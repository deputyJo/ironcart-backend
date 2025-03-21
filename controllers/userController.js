const { User } = require("../models/userSchema");
const { sanitize } = require("../utils/sanitize");
const { authLogin } = require("../controllers/authController");
const logger = require('../utils/logger');
const { generateToken } = require('../utils/generateToken');
const { error } = require("winston");
const { verifyRecaptcha } = require("../utils/recaptcha");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");
const AppError = require("../utils/AppError");

function validateInputLengthMax(username) {

    if (typeof username === "string"
        && username
        && username.length > 0) {
        return username.length <= 12; // Max length 12
    }

    logger.warn(`Invalid input: ${username}`);
    return false;
}

function validateInputLengthMin(username) {

    if (typeof username === "string"
        && username) {
        return username.length >= 6 && username.length <= 50; // Min length 6, max length 50
    }

    logger.warn(`Invalid input: ${username}`);
    return false;

}


//  Register a new user
const registerUser = async (req, res, next) => {
    try {
        const { username, password, email, recaptchaToken } = req.body;

        console.log("about to verify reCAPTCHA");

        // Skip reCAPTCHA check in development
        if (process.env.NODE_ENV !== "development") {
            const recaptchaResult = await verifyRecaptcha(recaptchaToken);
            if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
                throw new AppError("reCAPTCHA verification failed. Possible bot activity detected.", 400);
            }
        } else {
            console.log(" Skipping reCAPTCHA verification in development mode.");
        }


        // Check if user already exists
        let user = await User.findOne({ email });

        if (user) {
            logger.warn(`User already exists: ${user.email}`);
            throw new AppError("User already exists. Please sign in.", 400);
        }

        // Generate a verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");

        user = new User({
            username: sanitize("username", username),
            password: sanitize("password", password),
            email: sanitize("email", email),
            verificationToken,
            verified: false
        });

        // Reject invalid inputs
        if (!username || typeof username !== "string" || !password || typeof password !== "string" || !email || typeof email !== "string") {
            logger.warn(`Invalid input: ${email}`);
            throw new AppError("Invalid input.", 400);
        }

        if (!validateInputLengthMax(password) || !validateInputLengthMax(username)) {
            logger.warn("Invalid input: min length is 1 and max length is 12.");
            throw new AppError("Invalid input: invalid input length.", 400);
        }

        if (!validateInputLengthMin(email)) {
            logger.warn("Invalid input: min length is 6 and max length is 50.");
            throw new AppError("Invalid input: invalid input length.", 400);
        }


        await user.save();

        // Create email verification link
        const verificationLink = `http://localhost:3000/users/verify/${verificationToken}`;
        const emailHtml = `<p>Click the link below to verify your email:</p>
                           <a href="${verificationLink}">${verificationLink}</a>`; //URL should be visible for the user

        // Send verification email
        await sendEmail(email, "Verify your email", emailHtml);

        logger.info(`User registered: ${email}`);
        return res.status(201).json({ message: "User registered! Please check your email for verification." });

    } catch (error) {
        logger.error(`Failure generating a user: ${email}`);
        next(error instanceof AppError ? error : new AppError("Something went wrong, user registration failure.", 500));
    }
};





//  Login a user
const loginUser = async (req, res, next) => {
    try {

        let { username, password, email, recaptchaToken } = req.body;


        // Verify reCAPTCHA token
        const recaptchaResult = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
            throw new AppError("reCAPTCHA verification failed. Possible bot activity detected.", 400);
        }


        // Check if email & password exist
        if (!email || !password) {
            logger.warn("Login error: Email or password is missing.");
            throw new AppError("Email and password are required.", 400);
        }

        username = sanitize("username", username);
        email = sanitize("email", email);
        password = sanitize("password", password);


        if (!email) {
            console.error(" Email became undefined before querying the database!");
            throw new AppError("Email is required (unexpected behavior).", 400);
        }

        const user = await User.findOne({ email }).select("+password");


        if (!user) {
            logger.warn(` Can't log in user: ${email}. User is invalid`);
            throw new AppError("Invalid email or password", 400);
        }

        //  Block login if user is NOT verified
        if (!user.verified) {
            logger.warn(` Can't log in user: ${email}. User is not verified!`);
            throw new AppError("Please verify your email before logging in.", 403);
        }

        // Check if the provided password matches the stored hashed password
        const isPasswordValid = await user.comparePassword(password);

        if (!isPasswordValid) {
            logger.warn(`Login failed: Incorrect password for ${email}`);
            throw new AppError("Invalid email or password", 400);
        }

        // // Generate JWT token for the user
        // const token = generateToken({ _id: user._id });

        logger.info(`User logged in successfully: ${user.email}`);
        // return res.status(200).json({ message: "Login successful!", token });
        // ✅ User is authenticated → Call `authLogin` to handle tokens
        return authLogin(user, res, next);

    } catch (error) {
        next(error instanceof AppError ? error : new AppError("Something went wrong, please try again later.", 500));

    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { token } = req.params; //Get the token from the URL

        const user = await User.findOne({ verificationToken: token }).select("+password"); //Check if a user exidts with this token

        if (!user) {
            logger.warn(`Token not found in databasae: ${token}`);
            throw new AppError("Invalid or expired token.", 400);
        }

        // use updateOne() insted of save() to prevent password requirement
        await User.updateOne(
            { _id: user._id },  //  Find the user by their unique ID
            { $set: { verified: true, verificationToken: null } }   //   Update these fields
        );


        logger.info(`✅ Email verified for: ${user.email}`);
        return res.status(200).json({ message: "Email successfully verified! You can now log in." });
    } catch (error) {
        logger.error(`Error during email verification: ${error.message}`);
        next(error instanceof AppError ? error : new AppError("Something went wrong, email could not be verified.", 500));
    }
};



module.exports = { registerUser, loginUser, verifyEmail };


if (process.env.NODE_ENV === "test") {
    module.exports.validateInputLengthMax = validateInputLengthMax;
    module.exports.validateInputLengthMin = validateInputLengthMin;
}
