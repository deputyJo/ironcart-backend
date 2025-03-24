const express = require("express");
const router = express.Router();

const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const verifyToken = require("../middleware/auth");
const rbac = require("../middleware/rbac");

// Create a new order (Customer only)
router.post("/checkout", verifyToken, rbac(["customer"]), createOrder);

// Get current user's orders (Customer only)
router.get("/my-orders", verifyToken, rbac(["customer"]), getMyOrders);

// Admin or seller can see all orders
router.get("/", verifyToken, rbac(["admin", "seller"]), getAllOrders);

// Admin can update order status
router.put("/:orderId/status", verifyToken, rbac(["admin"]), updateOrderStatus);

module.exports = router;
