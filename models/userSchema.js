const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const logger = require('../utils/logger');
const Joi = require('joi');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'input required'],
        unique: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9\s]+$/, 'No special characters allowed'],
        index: true,
        maxlength: 12,
        minlength: 6
    },
    password: {
        type: String,
        required: [true, 'input required'],
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/],
        maxlength: 68,
        minlength: 8,
        select: false
    },
    email: {
        type: String,
        required: [true, 'input required'],
        minlength: 6,
        index: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/]
    },
    verified: {
        type: Boolean,
        default: false  // ✅ NEW: Users are not verified by default
    },
    verificationToken: {
        type: String,
        default: null  // ✅ NEW: Store email verification token
    }
}, { timestamps: true });

UserSchema.pre("save", async function (next) {
    try {
        // Run Joi validation first
        const { error } = validateUser(this.toObject());
        if (error) {
            return next(new Error(error.details[0].message)); // Stop save if validation fails
        }

        if (!this.isModified("password") || !this.password) {
            return next();
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// ✅ Joi Validation Function (Kept & Updated)
function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string()
            .pattern(/^[a-zA-Z0-9\s]+$/)
            .min(6)
            .max(12)
            .required()
            .messages({
                "string.pattern.base": "No special characters allowed",
                "string.min": "Username must be at least 6 characters",
                "string.max": "Username cannot exceed 12 characters",
                "any.required": "Username is required"
            }),
        email: Joi.string()
            .email()
            .min(6)
            .required()
            .messages({
                "string.email": "Invalid email format",
                "string.min": "Email must be at least 6 characters",
                "any.required": "Email is required"
            }),
        password: Joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/)
            .min(8)
            .max(68)
            .required()
            .messages({
                "string.pattern.base": "Password must be 8-12 characters, include at least one uppercase letter, one lowercase letter, one number, and one special character",
                "string.min": "Password must be at least 8 characters",
                "string.max": "Password cannot exceed 68 characters",
                "any.required": "Password is required"
            }),
        verified: Joi.boolean().default(false),  // ✅ New field in Joi validation
        verificationToken: Joi.string().allow(null) // ✅ Allow null if user is verified
    }).unknown();

    return schema.validate(user);
}

// Password Verification 
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
logger.info("User model initialized successfully");

module.exports = {
    User,
    validateUser
};
