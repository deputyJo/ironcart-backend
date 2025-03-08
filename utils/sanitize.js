const logger = require('../utils/logger');


// Sanitize input 
function sanitize(type, target) {
    try {

        if (typeof target !== "string") {
            logger.warn(`Sanitization warning: Received invalid ${type}: ${target}`);
            return ""; // Prevents crashing
        }

        target = target.replace(/\\/g, "");

        if (type === "email") {
            return target.trim().replace(/\s+/g, "");
        }
        else if (type === "username") {
            return target.trim().replace(/[^a-zA-Z0-9]/g, "").replace(/\s+/g, "");
        }
        else if (type === "password") {
            return target.trim().replace(/\s+/g, "").replace(/@/g, "");
        }
    } catch (error) {
        logger.error(`Sanitization error: ${error.message}`);
        return "";
    }
}


module.exports = { sanitize };
