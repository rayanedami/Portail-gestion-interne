const express = require("express");
const router = express.Router();

const UtilisateurController = require("../controllers/UtilisateurController");

router.get("/", UtilisateurController.getAll);

router.get("/:id", UtilisateurController.getById);

module.exports = router;