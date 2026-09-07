const express = require("express");
const router = express.Router();

const VisiteController = require("../controllers/VisiteController");
const { requireRoles } = require("../middleware/auth");

router.use(requireRoles("AGENT_ACCUEIL", "ADMINISTRATEUR"));

router.post("/", VisiteController.create);
router.put("/:id", VisiteController.update);
router.delete("/:id", VisiteController.delete);

router.get("/", VisiteController.getAll);
router.get("/:id", VisiteController.getById);

module.exports = router;