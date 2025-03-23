const Cart = require("../models/cartSchema");
const Product = require("../models/productSchema");
const AppError = require("../utils/AppError");
const logger = require("../utils/logger");

// Add item to cart
const addToCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const { productId, quantity } = req.body;

        if (!productId || !quantity || quantity < 1) {
            throw new AppError("Product ID and valid quantity are required", 400);
        }

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        logger.info(`Product ${productId} added to cart for user ${userId}`);
        res.status(200).json({ message: "Product added to cart", cart });

    } catch (error) {
        logger.error(`❌ Cart update failed: ${error.message}`);
        next(error instanceof AppError ? error : new AppError("Could not update cart", 500));
    }
};

// View cart
const getCart = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId }).populate("items.product");

        if (!cart) {
            return res.status(200).json({ message: "Cart is empty", items: [] });
        }

        res.status(200).json(cart);

    } catch (error) {
        logger.error(`❌ Failed to retrieve cart: ${error.message}`);
        next(new AppError("Failed to retrieve cart", 500));
    }
};

module.exports = { addToCart, getCart };
