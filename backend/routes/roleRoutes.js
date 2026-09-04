const express = require("express");
const RoleController = require("../controllers/RoleController");
const { requireRoles } = require("../middleware/auth");

const router = express.Router();
router.get("/", requireRoles("ADMINISTRATEUR"), RoleController.getAll);

module.exports = router;