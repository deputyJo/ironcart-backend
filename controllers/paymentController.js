const stripe = require("stripe")(require("../config").stripeSecret);
const AppError = require("../utils/AppError");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");

const axios = require("axios");



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





const paypalCreateOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart || cart.items.length === 0) {
            throw new AppError("Cart is empty", 400);
        }

        const totalAmount = cart.items.reduce(
            (sum, item) => sum + item.product.price * item.quantity,
            0
        );

        const newOrder = await Order.create({
            user: userId,
            items: cart.items.map(item => ({
                product: item.product._id,
                quantity: item.quantity
            })),
            totalAmount,
            status: "Pending",
            payment: {
                isPaid: false,
                method: "PayPal"
            }
        });

        // 1. Get access token from PayPal
        const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
        const tokenRes = await axios.post(`${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
            new URLSearchParams({ grant_type: "client_credentials" }),
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                },
            }
        );

        const accessToken = tokenRes.data.access_token;
        console.log("💬 Access Token:", accessToken);
        console.log("💬 Creating PayPal Order with total:", totalAmount);
        // 2. Create PayPal order
        const orderRes = await axios.post(
            `${process.env.PAYPAL_API_BASE}/v2/checkout/orders`,
            {
                intent: "CAPTURE",
                purchase_units: [{
                    amount: {
                        currency_code: "GBP",
                        value: totalAmount.toFixed(2)
                    },
                    custom_id: newOrder._id.toString()
                }],
                application_context: {
                    return_url: "http://localhost:3000/paypal-success",
                    cancel_url: "http://localhost:3000/paypal-cancel"
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const approvalUrl = orderRes.data.links.find(link => link.rel === "approve")?.href;

        res.status(200).json({ approvalUrl });
    } catch (err) {
        console.error("❌ PayPal order creation failed:", err.response?.data || err.message);
        res.status(500).json({ message: "Failed to create PayPal order" });
    }
};




const paypalCaptureOrder = async (req, res, next) => {
    const { orderId } = req.body;

    if (!orderId) {
        return res.status(400).json({ message: "Missing PayPal order ID" });
    }

    try {
        // 1. Get new access token
        const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString("base64");
        const tokenRes = await axios.post(`${process.env.PAYPAL_API_BASE}/v1/oauth2/token`,
            new URLSearchParams({ grant_type: "client_credentials" }),
            {
                headers: {
                    Authorization: `Basic ${auth}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );
        const accessToken = tokenRes.data.access_token;

        // 2. Capture the payment
        const captureRes = await axios.post(
            `${process.env.PAYPAL_API_BASE}/v2/checkout/orders/${orderId}/capture`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json"
                }
            }
        );

        const payerEmail = captureRes.data.payer?.email_address;
        const status = captureRes.data.status;

        // ✅ FIXED: Extract correct custom_id from deep inside capture payload
        const customId = captureRes.data.purchase_units?.[0]?.payments?.captures?.[0]?.custom_id;

        console.log("💬 PayPal Order ID:", orderId);
        console.log("💬 Mongo Order ID (custom_id):", customId);

        if (customId && status === "COMPLETED") {
            await Order.findByIdAndUpdate(customId, {
                status: "Paid",
                "payment.isPaid": true,
                "payment.paidAt": new Date(),
                "payment.transactionId": orderId,
                "payment.method": "PayPal",
                "payment.payerEmail": payerEmail
            });

            await Cart.findOneAndUpdate({ user: req.user._id }, { $set: { items: [] } });
        }

        res.status(200).json({
            message: "Payment captured successfully",
            paypalStatus: status,
            paypalResponse: captureRes.data
        });

    } catch (err) {
        console.error("❌ PayPal capture failed:", err.response?.data || err.message);
        res.status(500).json({ message: "Failed to capture PayPal payment" });
    }
};




module.exports = { createCheckoutSession, paypalCreateOrder, paypalCaptureOrder };
