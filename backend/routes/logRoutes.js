const express = require("express");
const router = express.Router();

const LogController = require("../controllers/LogController");

router.get("/", LogController.getAll);
router.get("/:id", LogController.getById);

module.exports = router;