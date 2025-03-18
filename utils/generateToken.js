const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');
const AppError = require("../utils/AppError");

const generateToken = (user) => {

    try {

        if (typeof user !== "object" || !user || !user._id) {
            logger.error(`Error generating a JWT token!`);
            throw new AppError("Token generation error", 400);
        }

        return jwt.sign(

            { id: user._id },
            process.env.JWT_SECRET_KEY,
            { expiresIn: '1h' } // Token expires in 1 hour

        );
    }

    catch (error) {
        console.log("Token generation failed!");
        logger.error(`Error generating a JWT token! Error: ${error}`);
        throw new AppError("Token generation error", 500);
    }

};

module.exports = { generateToken };
