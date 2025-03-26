const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");

router.post("/create-session", authMiddleware, createCheckoutSession);

module.exports = router;
