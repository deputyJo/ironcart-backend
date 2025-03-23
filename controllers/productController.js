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

const getAllProducts = async (req, res, next) => {
    try {
        const products = await Product.find().populate("seller", "username email");
        res.status(200).json(products);
    } catch (error) {
        logger.error("❌ Failed to fetch products:", error);
        next(new AppError("Server error. Could not retrieve products.", 500));
    }
};


// Get product by ID
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate("seller", "email username");

        if (!product) {
            return next(new AppError("Product not found", 404));
        }

        res.status(200).json(product);
    } catch (error) {
        logger.error(`Failed to get product: ${error.message}`);
        next(new AppError("Failed to retrieve product", 500));
    }
};


const updateProduct = async (req, res, next) => {
    try {
        const { name, description, price, stock, category } = req.body;

        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }

        // Only the seller or an admin can update
        if (
            product.seller.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return next(new AppError("Unauthorized to update this product", 403));
        }

        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.stock = stock || product.stock;
        product.category = category || product.category;

        await product.save();

        logger.info(`Product updated: ${product._id}`);
        res.status(200).json({ message: "Product updated", product });
    } catch (error) {
        logger.error(`Product update failed: ${error.message}`);
        next(new AppError("Failed to update product", 500));
    }
};


const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new AppError("Product not found", 404));
        }

        // Only the seller or an admin can delete
        if (
            product.seller.toString() !== req.user._id.toString() &&
            req.user.role !== "admin"
        ) {
            return next(new AppError("Unauthorized to delete this product", 403));
        }

        await product.deleteOne();

        logger.info(`Product deleted: ${product._id}`);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        logger.error(`Product deletion failed: ${error.message}`);
        next(new AppError("Failed to delete product", 500));
    }
};



module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
