const express = require("express");

const router = express.Router();

const UtilisateurController = require("../controllers/UtilisateurController");
const { requireRoles } = require("../middleware/auth");

router.use(requireRoles("ADMINISTRATEUR"));

router.get("/", UtilisateurController.getAll);

router.put("/:id", UtilisateurController.update);

router.get("/:id", UtilisateurController.getById);

module.exports = router;