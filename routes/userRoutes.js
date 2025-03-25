const express = require("express");

const { registerUser, loginUser, verifyEmail } = require("../controllers/userController");
const rateLimit = require("express-rate-limit");
const rbac = require("../middleware/rbac");
const verifyToken = require("../middleware/auth");
const { User } = require("../models/userSchema");
const { validateRegister } = require("../middleware/validator");
const logger = require('../utils/logger');

const router = express.Router();

//Register requests
const limiterRegister = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour   Without it, rate limits wouldn’t reset
    max: 3, //max registration requests
    message: "Too many accounts created, please try again later.",
    headers: true //Include rate limit info in reponse headers
});

// Define the register route
router.post("/register", limiterRegister, validateRegister, registerUser);
// router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail); // Verificaction route

router.get("/all-users", verifyToken, rbac(["admin"]), async (req, res) => {
    try {
        console.log("req.user:", req.user); // 👈 Add this
        const users = await User.find().select("-password");
        logger.info(`Admin ${req.user.email} accessed all-users at ${new Date().toISOString()}`);
        res.status(200).json(users);
    } catch (error) {
        console.error("ERROR GETTING USERS:", error); // 👈 Add this too
        res.status(500).json({ error: "Server error. Could not retrieve users." });
    }
});


module.exports = router;
