const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    }
});

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    items: [orderItemSchema],
    totalAmount: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ["Pending", "Paid", "Shipped", "Delivered"],
        default: "Pending",
    },
    payment: {
        isPaid: { type: Boolean, default: false },
        paidAt: { type: Date },
        method: {
            type: String,
            enum: ["Stripe Checkout", "PayPal", "FakeGateway"],
            default: "Stripe Checkout"
        },
        transactionId: { type: String } // optional for trace/debug
    }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
