const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');
const AppError = require("../utils/AppError");

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header('Authorization');

        if (!token) {
            logger.warn("Access denied. No token provided.");
            throw new AppError("Access denied. No token provided.", 401);
        }

        // Verify the token
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET_KEY);

        req.user = {
            _id: verified.id,  // remap `id` back to `_id` for internal consistency
            role: verified.role
        };

        logger.info(`User successfully verified: ${verified._id}`);
        next();

    } catch (error) {
        if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
            logger.error(`JWT authentication error: ${error.message}`);
            next(new AppError("Invalid or expired token.", 403));
        } else {
            next(error instanceof AppError ? error : new AppError("Something went wrong, user token authentication error.", 500));
        }
    }
};

module.exports = authMiddleware;
