const User = require("../models/userSchema");
const Joi = require("joi");

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
        return res.status(400).json({ error: "Invalid input." }

        );
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
