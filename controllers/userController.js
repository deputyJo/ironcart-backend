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



        if (process.env.NODE_ENV !== "development") {
            const recaptchaResult = await verifyRecaptcha(recaptchaToken);
            if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
                throw new AppError("reCAPTCHA verification failed. Possible bot activity detected.", 400);
            }
        } else {
            console.log("Skipping reCAPTCHA verification in development mode.");
        }


        username = sanitize("username", username);
        email = sanitize("email", email);
        password = sanitize("password", password);




        const user = await User.findOne({ email }).select("+password");




        //  Block login if user is not verified
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



        logger.info(`User logged in successfully: ${user.email}`);

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
            logger.warn(`Token not found in database: ${token}`);
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


