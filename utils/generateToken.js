const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');

const generateToken = (user) => {

    try {

        if (Object.keys(user).length === 0 || !user || !user._id) {
            logger.error(`Error generating a JWT token! Error: ${error}`);
            throw new Error("Token generation error");
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
        throw new Error("Token generation error");
    }

};

module.exports = { generateToken };
