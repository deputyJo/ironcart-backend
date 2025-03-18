const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const { generateToken } = require("../utils/generateToken");
const { sanitize } = require("../utils/sanitize");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

const authLogin = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        email = sanitize("email", email);

        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            logger.warn(`User not found. Can't authenticate.`);
            throw new AppError("User not found", 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn("bcrypt error - password mismatch");
            throw new AppError("Incorrect password", 400);
        }

        const token = generateToken(user);
        if (!token) {
            logger.warn("Failure generating a token");
            throw new AppError("Token generation error", 400);
        }

        logger.info(`User authenticated and logged in. Email: ${email}`);
        res.status(200).json({ message: `Token generated! User: ${user.username} logged in!`, token });

    } catch (error) {
        console.error("Auth Login Error:", error.message);
        next(error instanceof AppError ? error : new AppError("Something went wrong. Authentication error.", 500));
    }
};

// Refresher token
const refreshTokenHandler = async (req, res, next) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(403).json({ message: "Refresh token required." });

        // Verify refresh token signature
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User.findById(decoded._id);
        if (!user || !user.refreshToken) return res.status(403).json({ message: "Invalid refresh token." });

        // Compare the hashed refresh token using the userSchema method
        const isValid = await user.compareHashedValue(refreshToken, user.refreshToken);
        if (!isValid) return res.status(403).json({ message: "Invalid refresh token." });

        // Generate new access token
        const newAccessToken = jwt.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });

        res.json({ accessToken: newAccessToken });
    } catch (error) {
        next(error);
    }
};

// Make sure both functions are exported
module.exports = { authLogin, refreshTokenHandler };
