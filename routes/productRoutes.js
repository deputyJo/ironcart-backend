const express = require("express");
const router = express.Router();

const { createProduct, getAllProducts, getProductById, updateProduct, deleteProduct } = require("../controllers/productController");
const verifyToken = require("../middleware/auth");
const rbac = require("../middleware/rbac");

// Create a product — only 'admin' and 'seller' can do this
router.post("/", verifyToken, rbac(["admin", "seller"]), createProduct);
router.get("/", getAllProducts);    //  returns all products in the DB
router.get("/:id", getProductById); //  Get a single product by ID
router.put("/:id", verifyToken, rbac(["admin", "seller"]), updateProduct);  //  Update product
router.delete("/:id", verifyToken, rbac(["admin", "seller"]), deleteProduct);   //  Delete product

module.exports = router;
