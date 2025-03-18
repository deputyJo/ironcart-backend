require('dotenv').config(); // Load environment variables

const config = {
    port: process.env.PORT || 3000,
    dbUrl: process.env.NODE_ENV === 'production' ? process.env.PROD_DB_URL : process.env.DEV_DB_URL
};

module.exports = config;
