const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/auth");

const rbac = require("../middleware/rbac");

const { User } = require("../models/userSchema");
const logger = require("../utils/logger");

const {
    getAllOrders,
} = require("../controllers/orderController");

const { getAllProducts } = require("../controllers/productController");

//Get all users
router.get("/all-users", verifyToken, rbac(["admin"]), async (req, res) => {
    try {
        console.log("req.user:", req.user); // 👈 Add this
        const users = await User.find().select("-password");
        logger.info(`Admin ${req.user.email} accessed all-users at ${new Date().toISOString()}`);
        res.status(200).json(users);
    } catch (error) {
        console.error("ERROR GETTING USERS:", error); // 👈 Add this too
        res.status(500).json({ error: "Server error. Could not retrieve users." });
    }
});

//Get all orders
router.get("/all-orders", verifyToken, rbac(["admin"]), getAllOrders);

//Get all products
router.get("/all-products", verifyToken, rbac(["admin"]), getAllProducts);    //  returns all products in the DB


module.exports = router;