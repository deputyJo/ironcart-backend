const dotenv = require('dotenv');
dotenv.config();

const config = require('./config.json');


const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require('mongoose');

const userRoutes = require("./routes/userRoutes");
const logger = require('./utils/logger');


//Estabilish MongoDB connection
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        logger.info('Connected to Mongodb');
    }).catch((error) => {
        logger.error(`Error connecting to MongoDB: ${error.message}`, { stack: error.stack });
    });



//Middleware

app.use("/auth", userRoutes);


module.exports = app;


// Only start the server if not in a test environment
if (process.env.NODE_ENV !== 'test') {
    app.listen(config.app.port, () => {
        logger.info(`Running on port ${config.app.port}`);
    });
}
