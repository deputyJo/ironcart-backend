//Handles the user authorization

const bcrypt = require("bcrypt");
const User = require("../models/userSchema");
const { generateToken } = require("../utils/generateToken");
const { sanitize } = require("../utils/sanitize");
const logger = require('../utils/logger');

const authLogin = async (req, res) => {
    try {
        let { email, password } = req.body;
        email = sanitize(email);

        const user = await User.findOne({ email });

        if (!user) {
            logger.warn(`User not found. Can't authenticate.`);
            throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            logger("bcrypy error - password mismach");
            throw new Error("Incorrect password");
        }

        const token = generateToken(user);

        if (!token) {
            logger.warn("Failure generating a token");
            throw new Error("Token generation error");
        }

        logger.info(`User authenticated and logged in. Email: ${email}`);
        res.status(200).json({ message: `Token generated! User: ${user.username} logged in!`, token });

    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
};


module.exports = { authLogin };
