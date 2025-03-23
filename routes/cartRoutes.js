const express = require("express");
const router = express.Router();
const { addToCart, getCart } = require("../controllers/cartController");
const verifyToken = require("../middleware/auth");

router.post("/add", verifyToken, addToCart);
router.get("/", verifyToken, getCart);

module.exports = router;
