//Protects the routes - for restricted access websites

const jwt = require('jsonwebtoken');
require('dotenv').config();
const logger = require('../utils/logger');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization');

    if (!token) {
        logger.warn(`Access denied. No token provided. User: ${req.email}`);
        return res.status(401).json({ error: "Access denied. No token provided." })
    };

    try {
        const verified = jwt.verify(token.replace("Bearer ", ""), process.env.JWT_SECRET_KEY);
        req.user = verified;
        logger.info(`User successfully verified: ${req.email}`);
        next();
    } catch (error) {
        logger.error(`JWT authentication error! User: ${req.email} Error: ${error}`);
        res.status(403).json({ error: "Invalid or expired token." });
    }
};

module.exports = authMiddleware;
