const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const config = require('./config.json');


const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');

const userRoutes = require("./routes/userRoutes");
const logger = require('./utils/logger');


const corsOptions = {
    origin: 'http://localhost:3000', // // Replace with your frontend domain
    methods: 'GET,POST', // Allow only these methods, add PUT and DELETE as needed
    allowedHeaders: ['Content-Type', 'Authorization'],// Allow only these headers
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};



//Estabilish MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        logger.info('Connected to Mongodb');
    }).catch((error) => {
        logger.error(`Error connecting to MongoDB: ${error.message}`, { stack: error.stack });
    });



//Middleware
app.use(cors(corsOptions)); // Enable CORS for all origins, CORS must be applied before the routes
app.use("/auth", userRoutes);


module.exports = app;


// Only start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(config.app.port, () => {
        logger.info(`Running on port ${config.app.port}`);
    });
}
