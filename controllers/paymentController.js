const stripe = require("stripe")(require("../config").stripeSecret);
const AppError = require("../utils/AppError");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");

const createCheckoutSession = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            throw new AppError("Cart is empty", 400);
        }

        const lineItems = cart.items.map(item => ({
            price_data: {
                currency: "gbp",
                product_data: {
                    name: item.product.name,
                },
                unit_amount: item.product.price * 100,
            },
            quantity: item.quantity,
        }));

        const totalAmount = cart.items.reduce(
            (total, item) => total + item.quantity * item.product.price,
            0
        );

        const newOrder = new Order({
            user: userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity,
            })),
            totalAmount,
            status: "Pending"
        });

        await newOrder.save();

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "payment",
            line_items: lineItems,
            automatic_tax: { enabled: true },
            success_url: `${process.env.FRONTEND_URL}/success`,
            cancel_url: `${process.env.FRONTEND_URL}/cancel`,
            metadata: {
                orderId: newOrder._id.toString(),
            }
        });

        res.status(200).json({ url: session.url });

    } catch (err) {
        console.error("Stripe session creation failed:", err.message);
        next(new AppError("Failed to create Stripe session", 500));
    }
};

module.exports = { createCheckoutSession };
