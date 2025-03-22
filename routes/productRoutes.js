const express = require("express");
const router = express.Router();

const { createProduct } = require("../controllers/productController");
const verifyToken = require("../middleware/auth");
const rbac = require("../middleware/rbac");

// Create a product — only 'admin' and 'seller' can do this
router.post("/", verifyToken, rbac(["admin", "seller"]), createProduct);

module.exports = router;
