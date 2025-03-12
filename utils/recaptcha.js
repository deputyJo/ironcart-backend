const axios = require("axios");

const verifyRecaptcha = async (token) => {
    if (process.env.NODE_ENV === "development") {
        console.log("Skipping reCAPTCHA verification in development mode.");
        return { success: true, score: 1.0 }; // Always pass reCAPTCHA in dev mode
    }

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: token,
            },
        });

        return response.data; // { success: true/false, score: 0.0 - 1.0 }
    } catch (error) {
        console.error("reCAPTCHA verification failed:", error.message);
        return { success: false };
    }
};

module.exports = { verifyRecaptcha };
