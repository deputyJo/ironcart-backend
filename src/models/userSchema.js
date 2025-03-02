const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
// const logger = require('../utils/logger');

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
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,12}$/,
            'Password must be 8-12 characters and include at least one uppercase letter, /one lowercase letter, one number, and one special character'],
        maxlength: 68,   // Increase max length for security
        minlength: 8,    //Minimum 8 Characters (Prevents weak passwords)
        select: false // Do not return password in queries by default -  Use select: false for passwords so they don't leak in API responses
    },
    email: {
        type: String,
        required: [true, 'input required'],
        minlength: 6,
        index: true,
        trim: true,
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            'Invalid email format: requires exactly one @ and a valid domain']
    }
}, { timestamps: true });   //timestamps: true (Automatically records createdAt and updatedAt)

UserSchema.pre("save", async function (next) {
    try {
        if (!this.isModified("password")) {
            return next();
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt); //Hashing with bcryptjs (Prevents storing raw passwords)
        next();
    } catch (error) {
        // logger.error("Password hashing error!", error);
        next(error);
    }
});


// Password Verification 
UserSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", UserSchema);
logger.info("User model initialized successfully");

module.exports = User;
