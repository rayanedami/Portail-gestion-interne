const express = require("express");
const router = express.Router();

const ValidationController = require("../controllers/ValidationController");
const { requireRoles } = require("../middleware/auth");

router.use(requireRoles("RESPONSABLE", "ADMINISTRATEUR"));

router.post("/decision", ValidationController.decide);

router.get("/", ValidationController.getAll);
router.get("/:id", ValidationController.getById);

module.exports = router;