const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");
const { requireAuth } = require("../middleware/auth");

// Connexion
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// Inscription visiteur
router.post("/register", AuthController.register);

router.put("/profile", requireAuth, AuthController.updateProfile);

module.exports = router;