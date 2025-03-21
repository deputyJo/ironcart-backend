const express = require("express");
const { authLogin, refreshTokenHandler, logoutUser } = require("../controllers/authController");
const { loginUser } = require("../controllers/userController");
const rateLimit = require("express-rate-limit");
const { validateLogin } = require("../middleware/validator");

const router = express.Router();

// Rate limiting for login requests
const limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login attempts per window
    message: "Too many login attempts, please try again later."
});

const limiterRefresh = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Allow more than login, since it’s passive
    message: "Too many token refresh requests. Please slow down."
});

const limiterLogout = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // Generous, it’s harmless, protecting the server infrastructure from unnecessary traffic and abuse (DoS Protection), Log File Bloating / Audit Trails, Fair Use & UX Defense
    message: "Too many logout requests. Please slow down."
});


router.post("/login", limiterLogin, validateLogin, loginUser);
router.post("/refresh", limiterRefresh, refreshTokenHandler); //  Route to refresh token 
router.post("/logout", limiterLogout, logoutUser); //  Route to log out the user 

module.exports = router;
