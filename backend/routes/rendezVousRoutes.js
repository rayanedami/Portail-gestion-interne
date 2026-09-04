const express = require("express");
const router = express.Router();

const RendezVousController = require("../controllers/RendezVousController");
const { requireRoles } = require("../middleware/auth");

router.use(requireRoles("COLLABORATEUR", "RESPONSABLE", "ADMINISTRATEUR", "AGENT_ACCUEIL", "VISITEUR"));

router.post("/", RendezVousController.create);
router.put("/:id", RendezVousController.update);
router.delete("/:id", RendezVousController.delete);

router.get("/", RendezVousController.getAll);
router.get("/:id", RendezVousController.getById);

module.exports = router;