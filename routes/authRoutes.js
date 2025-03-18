
const express = require("express");
const { generateToken } = require("../controllers/authController");
const { verifyEmail } = require("../controllers/userController");
const { authLogin, refreshTokenHandler } = require("../controllers/authController");

const router = express.Router();

router.post("/refresh", refreshTokenHandler); // Refresh token route
router.get("/verify/:token", verifyEmail); // Verificaction route

module.exports = router;

