const express = require("express");
const router = express.Router();

const VisiteurController = require("../controllers/VisiteurController");
const { requireRoles } = require("../middleware/auth");

router.post("/", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR"), VisiteurController.create);
router.put("/:id", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR"), VisiteurController.update);
router.delete("/:id", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR"), VisiteurController.delete);

router.get("/", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR", "VISITEUR"), VisiteurController.getAll);
router.get("/:id", requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR", "VISITEUR"), VisiteurController.getById);

module.exports = router;