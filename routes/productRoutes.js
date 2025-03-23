const express = require("express");
const router = express.Router();

const { createProduct, getAllProducts } = require("../controllers/productController");
const verifyToken = require("../middleware/auth");
const rbac = require("../middleware/rbac");

// Create a product — only 'admin' and 'seller' can do this
router.post("/", verifyToken, rbac(["admin", "seller"]), createProduct);
router.get("/", getAllProducts);    //  returns all products in the DB

module.exports = router;
