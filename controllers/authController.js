//Handles the user authorization

const bcrypt = require("bcrypt");
const { User } = require("../models/userSchema");
const { generateToken } = require("../utils/generateToken");
const { sanitize } = require("../utils/sanitize");
const logger = require('../utils/logger');
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
        console.error(" Auth Login Error:", error.message);
        // If the error was already thrown as an AppError (expected error), pass it as is.
        // Otherwise, wrap it in a new AppError to prevent leaking internal details.
        next(error instanceof AppError ? error : new AppError("Something went wrong. Authentication error.", 500));
    }
};



module.exports = { authLogin };
