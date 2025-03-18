const nodemailer = require("nodemailer");
const logger = require("../utils/logger");
const AppError = require("../utils/AppError");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to,
            subject,
            html
        });
        logger.info(`Email sent to ${to}`);
        return info;
    }
    catch (error) {
        logger.error(`Error sending email to ${to}: ${error.message}`);
        throw new AppError("Something went wrong, email generation failure.", 500)
    }
};

module.exports = { sendEmail };