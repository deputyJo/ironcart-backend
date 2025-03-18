const logger = require("./logger");

const errorHandler = (err, req, res, next) => {
    logger.error(`Server Error: ${err.message}`);

    // Set defauly status and message
    let statusCode = err.status || 500;
    let message = err.message || "Internal Server Error";

    // Hide specific error messages in production
    if (process.env.NODE_ENV === "production" && statusCode === 500) {
        message = "Something went wrong. Please try again later."; // Hide details
    }

    res.status(statusCode).json({ error: message });

}

module.exports = errorHandler;

