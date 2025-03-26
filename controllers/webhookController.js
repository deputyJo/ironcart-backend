const stripe = require("stripe")(require("../config").stripeSecret);
const Order = require("../models/orderSchema");
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

const handleStripeWebhook = async (req, res) => {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;

        // Example: Find your order by session ID or metadata
        const orderId = session.metadata?.orderId;

        if (orderId) {
            await Order.findByIdAndUpdate(orderId, {
                status: "Paid",
                "payment.isPaid": true,
                "payment.paidAt": new Date(),
                "payment.method": "Stripe Checkout",
                "payment.transactionId": session.payment_intent || session.id
            });
        }
    }

    res.status(200).json({ received: true });
};

module.exports = { handleStripeWebhook };
