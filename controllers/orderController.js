const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");


// 1. Create a new order
const createOrder = async (req, res, next) => {
    try {
        const userId = req.user._id;

        // Get the user's cart
        const cart = await Cart.findOne({ user: userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            throw new AppError("Your cart is empty", 400);
        }

        let totalAmount = 0;
        const orderItems = [];

        for (const item of cart.items) {
            const product = item.product;

            if (!product || product.stock < item.quantity) {
                throw new AppError(`Insufficient stock for ${product?.name}`, 400);
            }

            // Reduce stock
            product.stock -= item.quantity;
            await product.save();

            const itemTotal = item.quantity * product.price;
            totalAmount += itemTotal;

            orderItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });
        }

        // Simulated payment confirmation
        const paymentSuccess = Math.random() > 0.1;
        if (!paymentSuccess) throw new AppError("Payment failed. Try again.", 402);

        const order = new Order({
            user: userId,
            items: orderItems,
            totalAmount,
            status: "Pending"
        });

        await order.save();

        // Clear the cart
        await Cart.findOneAndDelete({ user: userId });

        logger.info(`🛒 Order created: ${order._id}`);
        res.status(201).json({ message: "Order placed successfully", order });

    } catch (error) {
        logger.error(`Order creation failed: ${error.message}`);
        next(error instanceof AppError ? error : new AppError("Order failed", 500));
    }
};


// 🛒 Get current user's orders (Customer)
const getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.product", "name price")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        logger.error(`❌ Failed to get user's orders: ${error.message}`);
        next(new AppError("Could not retrieve your orders", 500));
    }
};


// 🔍 Admin/Seller - Get all orders
const getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate("user", "username email")
            .populate("items.product", "name")
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        logger.error(`❌ Failed to get all orders: ${error.message}`);
        next(new AppError("Could not retrieve orders", 500));
    }
};


// 🚚 Admin - Update order status
const updateOrderStatus = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const validStatuses = ["Pending", "Shipped", "Delivered"];
        if (!validStatuses.includes(status)) {
            return next(new AppError("Invalid status", 400));
        }

        const order = await Order.findById(orderId);
        if (!order) {
            return next(new AppError("Order not found", 404));
        }

        order.status = status;
        await order.save();

        logger.info(`✅ Order status updated: ${order._id} → ${status}`);
        res.status(200).json({ message: "Order status updated", order });

    } catch (error) {
        logger.error(`❌ Failed to update order status: ${error.message}`);
        next(new AppError("Failed to update order status", 500));
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
};