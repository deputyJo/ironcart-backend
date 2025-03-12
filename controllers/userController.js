const { User } = require("../models/userSchema");
const { sanitize } = require("../utils/sanitize");
const { authLogin } = require("../controllers/authController");
const logger = require('../utils/logger');
const { generateToken } = require('../utils/generateToken');
const { error } = require("winston");


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

    const { username, password, email } = req.body;

    //Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
        logger.warn(`User already exisits: ${user.email}`);
        return res.status(400).json({ 'error': 'User already exists. Please sign in' });
    }




    user = new User({
        username: sanitize("username", username),
        password: sanitize("password", password),
        email: sanitize("email", email)
    });

    //  Reject invalid inputs
    if (!username || typeof username != "string"
        || !password || typeof password != "string"
        || !email || typeof email != "string") {

        logger.warn(`Invalid input: ${user.email}`);
        return res.status(400).json({ error: "Invalid input." });
    }

    else if (!validateInputLengthMax(password) || !validateInputLengthMax(username)) {
        logger.warn(`Invalid input: min length is 1 and max length is 12.`);
        return res.status(400).json({ error: "Invalid input: invalid input length." });
    }


    if (!validateInputLengthMin(email)) {
        logger.warn(`Invalid input: min length is 6 and max length is 50.`);
        return res.status(400).json({ error: "Invalid input: invalid input length." });
    }


    try {

        await user.save();
    }

    catch (error) {

        logger.error(`Failure generating a user: ${email}`);
        return res.status(500).json({ error: "Failure generating a user." });
    }


    try {
        const token = generateToken({ _id: user._id });
        logger.info(`User successfully registered: ${username}`);


        return res.status(201).json({ username, email, token });

    } catch (error) {
        logger.error(`Token generation failed for user: ${username}`);
        return res.status(500).json({ username, email });
    }
};




//  Login a user
const loginUser = async (req, res) => {
    try {

        let { username, password, email } = req.body;

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


module.exports = { registerUser, loginUser };


if (process.env.NODE_ENV === "test") {
    module.exports.validateInputLengthMax = validateInputLengthMax;
    module.exports.validateInputLengthMin = validateInputLengthMin;
}
