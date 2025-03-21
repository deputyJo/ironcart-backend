const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require("express-rate-limit");

const config = require('./config'); // Import config.js
const errorHandler = require("./utils/errorHandler");
const cookieParser = require("cookie-parser");

const express = require('express');
const app = express();
app.use(express.json());
app.use(cookieParser()); //   Enables reading cookies in requests
const mongoose = require('mongoose');

const authRoutes = require("./routes/authRoutes"); //
const userRoutes = require("./routes/userRoutes");
const logger = require('./utils/logger');

app.use(helmet({
    //CSP - prevents malicious scripts from running by restricting which sources can load scripts, styles and images
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"], // Only allow scripts from your own domain
            scriptSrc: ["'self'", "https://trusted-cdn.com"], // Allow specific external scripts
            styleSrc: ["'self'", "'unsafe-inline'"], // Allow styles from same origin
            imgSrc: ["'self'", "data:", "https://trusted-images.com"], // Allow images from trusted sources
            objectSrc: ["'none'"], // Prevent embedding objects (Flash, etc.)
            upgradeInsecureRequests: [], // Upgrade HTTP requests to HTTPS
        },
    },
}));

const mongoSanitize = require('express-mongo-sanitize');

//Protect agains NoSQL injection attacks
app.use(mongoSanitize({ replaceWith: "_" }));

const corsOptions = {
    origin: 'http://localhost:3000', // // Allows only local host:3000 connection
    methods: 'GET,POST', // Allow only these methods, add PUT and DELETE as needed
    allowedHeaders: ['Content-Type', 'Authorization'],// Allow only these headers
    optionsSuccessStatus: 200 // Ensures those old browsers don't break when sending CORS requests.
};

const xssClean = require("xss-clean");
app.use(xssClean());

app.use(cors(corsOptions)); // Enable CORS for the frontend only (localhost:3000)



//Estabilish MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        logger.info('Connected to Mongodb');
    }).catch((error) => {
        logger.error(`Error connecting to MongoDB: ${error.message}`, { stack: error.stack });
    });



app.use("/auth", authRoutes); // Authentication (login, refresh, logout)
app.use("/users", userRoutes); // User management (registration, email verification)
app.use(errorHandler);


module.exports = app;


// Only start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(config.port, () => {
        logger.info(`Running on port ${config.port}`);
    });
}
