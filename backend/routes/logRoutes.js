const express = require("express");
const router = express.Router();

const LogController = require("../controllers/LogController");

router.post("/", LogController.create);

router.get("/", LogController.getAll);
router.get("/:id", LogController.getById);

module.exports = router;