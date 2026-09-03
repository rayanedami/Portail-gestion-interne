const express = require("express");
const router = express.Router();

const AuthController = require("../controllers/AuthController");

// Connexion
router.post("/login", AuthController.login);

// Inscription visiteur
router.post("/register", AuthController.register);

module.exports = router;