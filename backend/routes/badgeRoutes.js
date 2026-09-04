const express = require("express");

const router = express.Router();

const BadgeController = require("../controllers/BadgeController");
const { requireRoles } = require("../middleware/auth");

router.post("/", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR"), BadgeController.create);
router.put("/:id", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR"), BadgeController.update);
router.delete("/:id", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR"), BadgeController.delete);

router.get("/", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR", "VISITEUR"), BadgeController.getAll);

router.get("/verify", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR"), BadgeController.verify);

router.get("/:id", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR", "VISITEUR"), BadgeController.getById);

module.exports = router;