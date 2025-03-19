const express = require("express");

const { registerUser, loginUser, verifyEmail } = require("../controllers/userController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

//Register requests
const limiterRegister = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour   Without it, rate limits wouldn’t reset
    max: 3, //max registration requests
    message: "Too many accounts created, please try again later.",
    headers: true //Include rate limit info in reponse headers
});

// Define the register route
router.post("/register", limiterRegister, registerUser);
// router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail); // Verificaction route

module.exports = router;
