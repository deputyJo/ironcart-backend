//Handles the user authorization

const bcrypt = require("bcrypt");
const { User } = require("../models/userSchema");
const { generateToken, generateRefreshToken } = require("../utils/generateToken");
const { sanitize } = require("../utils/sanitize");
const logger = require('../utils/logger');
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");

const authLogin = async (user, res, next) => {
    try {

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

        // logger.info(`User authenticated and logged in. Email: ${email}`);
        res.status(200).json({ message: `Token generated! User: ${user.username} logged in!`, accessToken: accessToken });

    } catch (error) {
        console.error(" Auth Login Error:", error.message);
        // If the error was already thrown as an AppError (expected error), pass it as is.
        // Otherwise, wrap it in a new AppError to prevent leaking internal details.
        next(error instanceof AppError ? error : new AppError("Something went wrong. Authentication error.", 500));
    }
};



const refreshTokenHandler = async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken; // Get token from cookies

        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token required" });
        }

        jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET, (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: "Invalid or expired refresh token" });
            }

            console.log("Decoded Refresh Token:", decoded); //  Log decoded payload for debugging


            const newAccessToken = generateToken({ _id: decoded.id });

            res.status(200).json({ accessToken: newAccessToken });
        });

    } catch (error) {
        console.error("Refresh Token Error:", error);
        next(error);
    }
};




const logoutUser = (req, res) => {
    res.clearCookie("refreshToken", { httpOnly: true, secure: false, sameSite: "Strict" });
    res.json({ message: "Logged out successfully" });
};



module.exports = { authLogin, refreshTokenHandler, logoutUser };
