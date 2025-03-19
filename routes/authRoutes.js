const express = require("express");
const { authLogin, refreshTokenHandler, logoutUser } = require("../controllers/authController");
const rateLimit = require("express-rate-limit");

const router = express.Router();

// Rate limiting for login requests
const limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts, please try again later."
});

router.post("/login", limiterLogin, authLogin);
router.post("/refresh", refreshTokenHandler); //  Route to refresh token (make sure it's implemented)
router.post("/logout", logoutUser); //  Route to log out the user (we'll implement this next)

module.exports = router;
