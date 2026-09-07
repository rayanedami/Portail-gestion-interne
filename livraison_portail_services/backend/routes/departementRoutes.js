const express = require("express");
const router = express.Router();
const DepartementController = require("../controllers/DepartementController");
const { requireRoles } = require("../middleware/auth");

router.get("/", requireRoles("ADMINISTRATEUR"), DepartementController.getAll);

module.exports = router;
