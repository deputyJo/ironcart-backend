const { body, validationResult } = require("express-validator");

// Registration validation rules
const validateRegister = [
    body("username")
        .isLength({ min: 6, max: 12 })
        .withMessage("Username must be 6–12 characters long")
        .matches(/^[a-zA-Z0-9]+$/)
        .withMessage("Username must not contain special characters"),

    body("email")
        .isEmail()
        .withMessage("Email must be valid"),

    body("password")
        .isLength({ min: 8, max: 68 })
        .withMessage("Password must be 8–68 characters long")
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage("Password must include uppercase, lowercase, number, and special character"),


    ...(process.env.NODE_ENV !== "development"
        ? [
            body("recaptchaToken")
                .notEmpty()
                .withMessage("reCAPTCHA token is required"),
        ]
        : []),

    // Error handling middleware
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ error: errors.array()[0].msg });
        }
        next();
    }
];

module.exports = {
    validateRegister
};
