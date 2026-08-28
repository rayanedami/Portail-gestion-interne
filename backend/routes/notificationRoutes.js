const express = require("express");
const router = express.Router();

const NotificationController = require("../controllers/NotificationController");

router.get("/", NotificationController.getAll);
router.get("/:id", NotificationController.getById);

module.exports = router;