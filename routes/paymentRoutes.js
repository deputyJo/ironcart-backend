const express = require("express");
const router = express.Router();
const { createCheckoutSession } = require("../controllers/paymentController");
const authMiddleware = require("../middleware/auth");

const { paypalCreateOrder, paypalCaptureOrder } = require("../controllers/paymentController");



router.post("/create-session", authMiddleware, createCheckoutSession);

router.post("/paypal-create-order", authMiddleware, paypalCreateOrder);
router.post("/paypal-capture-order", authMiddleware, paypalCaptureOrder);



module.exports = router;
