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

router.post("/login", limiterLogin, validateLogin, loginUser);


//NOT IMPLEMENTED YET
router.post("/refresh", refreshTokenHandler); //  Route to refresh token 
router.post("/logout", logoutUser); //  Route to log out the user 

module.exports = router;
