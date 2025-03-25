const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');
const AppError = require("../utils/AppError");

const generateToken = (user) => {

    try {

        if (typeof user !== "object" || !user || !user._id) {
            logger.error(`Error generating an Access Token!`);
            throw new AppError("Token generation error", 400);
        }

        return jwt.sign(

            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '15m' } // Token expires in 15 minutes

        );

    }

    catch (error) {
        logger.error(`Error generating an Access Token! Error: ${error}`);
        throw new AppError("Token generation error", 500);
    }

};

const generateRefreshToken = (user) => {

    try {

        if (typeof user !== "object" || !user || !user._id) {
            logger.error(`Error generating a Refresh Token!`);
            throw new AppError("Token generation error", 400);
        }

        return jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: "7d" }); // Long lifespan

    }

    catch (error) {
        logger.error(`Error generating a Refresh Token! Error: ${error}`);
        throw new AppError("Token generation error", 500);
    }

};



module.exports = { generateToken, generateRefreshToken };
