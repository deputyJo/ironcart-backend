const logger = require('../utils/logger');


// Sanitize input 
function sanitize(type, target) {


    try {

        //Remove the escape character
        target = target.replace(/\\/g, "");

        // Email - Only email is allowed the @ symbol
        if (type === "email") {

            // Convert to string, remove all spaces
            return String(target)
                .trim()
                .replace(/\s+/g, "");
        }

        else if (type === "username") {

            // Username - Convert to string, trim spaces, remove invalid character
            return String(target)
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "")
                .replace(/\s+/g, "");
        }


        else if (type === "password") {

            // Password - Remove all spaces and the @ character
            return String(target)
                .trim()
                .replace(/\s+/g, "")
                .replace(/@/g, "");
        }

    }

    catch (error) {
        logger.error(`Sanitization error: ${error.message}`);
        return ""; //  Return empty string to prevent failures
    }

}

module.exports = { sanitize };
