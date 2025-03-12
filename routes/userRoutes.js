const express = require("express");

const { registerUser, loginUser, verifyEmail } = require("../controllers/userController");

const router = express.Router();


// Define the register route
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/verify/:token", verifyEmail); // ✅ Add this verification route

module.exports = router;
