const express = require("express");
const router = express.Router();

const NotificationController = require("../controllers/NotificationController");
const { requireRoles } = require("../middleware/auth");

router.use(requireRoles("COLLABORATEUR", "RESPONSABLE", "ADMINISTRATEUR", "AGENT_ACCUEIL", "VISITEUR"));

router.post("/", NotificationController.create);
router.put("/:id", NotificationController.update);
router.delete("/:id", NotificationController.delete);

router.get("/", NotificationController.getAll);
router.get("/:id", NotificationController.getById);

module.exports = router;