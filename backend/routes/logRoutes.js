const express = require("express");
const router = express.Router();

const LogController = require("../controllers/LogController");
const { requireRoles } = require("../middleware/auth");

router.use(requireRoles("ADMINISTRATEUR"));

router.get("/", LogController.getAll);
router.get("/:id", LogController.getById);

module.exports = router;