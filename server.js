const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

const config = require('./config.json');


const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');


const userRoutes = require("./routes/userRoutes");
const logger = require('./utils/logger');

app.use(helmet());

const mongoSanitize = require('express-mongo-sanitize');

//Protect agains NoSQL injection attacks
app.use(mongoSanitize({ replaceWith: "_" }));

const corsOptions = {
    origin: 'http://localhost:3000', // // Allows only local host:3000 connection
    methods: 'GET,POST', // Allow only these methods, add PUT and DELETE as needed
    allowedHeaders: ['Content-Type', 'Authorization'],// Allow only these headers
    optionsSuccessStatus: 200 // Ensures those old browsers don't break when sending CORS requests.
};

app.use(cors(corsOptions)); // Enable CORS for the frontend only (localhost:3000)

//Login requests
const limiterLogin = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes   Without it, rate limits wouldn’t reset
    max: 5, //max login requests
    message: "Too many login requests, please try again later.",
    headers: true //Include rate limit info in reponse headers
});

//Register requests
const limiterRegister = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour   Without it, rate limits wouldn’t reset
    max: 3, //max registration requests
    message: "Too many accounts created, please try again later.",
    headers: true //Include rate limit info in reponse headers
});



//Estabilish MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        logger.info('Connected to Mongodb');
    }).catch((error) => {
        logger.error(`Error connecting to MongoDB: ${error.message}`, { stack: error.stack });
    });



//Routes
app.use("/auth/login", limiterLogin);
app.use("/auth/register", limiterRegister);
app.use("/auth", userRoutes);



module.exports = app;


// Only start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(config.app.port, () => {
        logger.info(`Running on port ${config.app.port}`);
    });
}
