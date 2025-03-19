//Handles the user authorization

const bcrypt = require("bcrypt");
const { User } = require("../models/userSchema");
const { generateToken, generateRefreshToken } = require("../utils/generateToken");
const { sanitize } = require("../utils/sanitize");
const logger = require('../utils/logger');
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const authLogin = async (req, res, next) => {
    try {
        let { email, password } = req.body;
        email = sanitize("email", email);

        const user = await User.findOne({ email }).select("+password");

        if (!user || !user.password) {
            logger.warn(`User not found. Can't authenticate.`);
            throw new AppError("User not found", 400);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger.warn("bcrypt error - password mismatch");
            throw new AppError("Incorrect password", 400);
        }

        const accessToken = generateToken(user);
        const refreshToken = generateRefreshToken(user);

        if (!accessToken) {
            logger.warn("Failure generating a token");
            throw new AppError("Token generation error", 400);
        }

        if (!refreshToken) {
            logger.warn("Failure generating a refresh token");
            throw new AppError("Refresh token generation error", 400);
        }

        // Set refresh token in an HTTP-Only cookie
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true, // Prevents client-side JavaScript from accessing it
            secure: false, // Ensures cookie is only sent over HTTPS (set to false in dev mode if using localhost)
            sameSite: "Strict", // Prevents CSRF attacks
            maxAge: 7 * 24 * 60 * 60 * 1000 // Cookie expiration date - 7 days
        });


        logger.info(`User authenticated and logged in. Email: ${email}`);
        res.status(200).json({ message: `Token generated! User: ${user.username} logged in!`, accessToken: accessToken });

    } catch (error) {
        console.error(" Auth Login Error:", error.message);
        // If the error was already thrown as an AppError (expected error), pass it as is.
        // Otherwise, wrap it in a new AppError to prevent leaking internal details.
        next(error instanceof AppError ? error : new AppError("Something went wrong. Authentication error.", 500));
    }
};



module.exports = { authLogin };
