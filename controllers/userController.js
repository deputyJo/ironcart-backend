const { User } = require("../models/userSchema");
const { sanitize } = require("../utils/sanitize");
const { authLogin } = require("../controllers/authController");
const logger = require('../utils/logger');
const { generateToken } = require('../utils/generateToken');
const { error } = require("winston");
const { verifyRecaptcha } = require("../utils/recaptcha");
const crypto = require("crypto");
const { sendEmail } = require("../utils/email");

function validateInputLengthMax(username) {
    try {
        if (typeof username === "string"
            && username
            && username.length > 0) {
            return username.length <= 12; // Max length 12
        }

        logger.warn(`Invalid input: ${username}`);
        throw new Error("Invalid input");
    }

    catch (error) {
        throw new Error("Invalid input");
    }


}

function validateInputLengthMin(username) {

    try {
        if (typeof username === "string"
            && username) {
            return username.length >= 6 && username.length <= 50; // Min length 6, max length 50
        }

        logger.warn(`Invalid input: ${username}`);
        throw new Error("Invalid input");
    }

    catch (error) {
        throw new Error("Invalid input");
    }
}


//  Register a new user
const registerUser = async (req, res) => {
    const { username, password, email, recaptchaToken } = req.body;

    // Verify reCAPTCHA token
    const recaptchaResult = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
        return res.status(400).json({ error: "reCAPTCHA verification failed. Possible bot activity detected." });
    }

    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
        logger.warn(`User already exists: ${user.email}`);
        return res.status(400).json({ error: "User already exists. Please sign in." });
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
        return res.status(400).json({ error: "Invalid input." });
    }

    if (!validateInputLengthMax(password) || !validateInputLengthMax(username)) {
        logger.warn("Invalid input: min length is 1 and max length is 12.");
        return res.status(400).json({ error: "Invalid input: invalid input length." });
    }

    if (!validateInputLengthMin(email)) {
        logger.warn("Invalid input: min length is 6 and max length is 50.");
        return res.status(400).json({ error: "Invalid input: invalid input length." });
    }

    try {
        await user.save();

        // Create email verification link
        const verificationLink = `http://localhost:3000/auth/verify/${verificationToken}`;
        const emailHtml = `<p>Click the link below to verify your email:</p>
                           <a href="${verificationLink}">${verificationLink}</a>`; //URL should be visible for the user 

        // Send verification email
        await sendEmail(email, "Verify your email", emailHtml);

        return res.status(201).json({ message: "User registered! Please check your email for verification." });
    } catch (error) {
        logger.error(`Failure generating a user: ${email}`);
        return res.status(500).json({ error: "Failure generating a user." });
    }
};





//  Login a user
const loginUser = async (req, res) => {
    try {

        let { username, password, email, recaptchaToken } = req.body;

        // Verify reCAPTCHA token
        const recaptchaResult = await verifyRecaptcha(recaptchaToken);
        if (!recaptchaResult.success || recaptchaResult.score < 0.5) {
            return res.status(400).json({ error: "reCAPTCHA verification failed. Possible bot activity detected." });
        }
        console.log(username);

        if (!email) {
            logger.warn(" Login error: Email is missing from request.");
            return res.status(400).json({ error: "Email is required." });
        }

        username = sanitize("username", username);
        email = sanitize("email", email);
        password = sanitize("password", password);


        if (!email) {
            console.error(" Email became undefined before querying the database!");
            return res.status(400).json({ error: "Email is required (unexpected behavior)." });
        }

        const user = await User.findOne({ email });


        if (!user) {
            logger.warn(` Can't log in user: ${email}. User is invalid`);
            return res.status(400).json({ error: "Invalid email or password" });
        }

        await authLogin(req, res);

    } catch (error) {
        return res.status(500).json({ error: "500 Internal Server Error" });
    }
};

const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params; //Get the token from the URL

        const user = await User.findOne({ verificationToken: token }).select("+password"); //Check if a user exidts with this token

        if (!user) {
            logger.warn(`Token not found in databasae: ${token}`);
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        // //Mark user as verified
        // user.verified = true;
        // user.verificationToken = null; //Remove token after verification
        // await user.save({ validateBeforeSave: false }); //Ignore password valiation

        await User.updateOne(
            { _id: user._id },
            { $set: { verified: true, verificationToken: null } }
        );


        logger.info(`✅ Email verified for: ${user.email}`);
        return res.status(200).json({ message: "Email successfully verified! You can now log in." });
    } catch (error) {
        logger.error(`Error during email verification: ${error.message}`);
        return res.status(500).json({ error: "Internal Server Error." });
    }
};



module.exports = { registerUser, loginUser, verifyEmail };


if (process.env.NODE_ENV === "test") {
    module.exports.validateInputLengthMax = validateInputLengthMax;
    module.exports.validateInputLengthMin = validateInputLengthMin;
}
