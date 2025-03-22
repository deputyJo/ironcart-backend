const Product = require("../models/productSchema");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

const createProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!req.user || !req.user._id) {
            logger.error("Product creation failed: Missing user ID from token.");
            throw new AppError("Unauthorized. No user ID found.", 401);
        }

        const product = new Product({
            name,
            description,
            price,
            stock,
            category,
            seller: req.user._id,
        });

        await product.save();

        logger.info(`✅ Product created: ${product.name} by ${req.user._id}`);
        res.status(201).json({ message: "Product created", product });

    } catch (error) {
        logger.error(`❌ Product creation failed: ${error.message}`);
        next(error instanceof AppError ? error : new AppError("Could not create product", 500));
    }
};

module.exports = {
    createProduct
};
