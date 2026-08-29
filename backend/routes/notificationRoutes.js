const express = require("express");
const router = express.Router();

const NotificationController = require("../controllers/NotificationController");

router.post("/", NotificationController.create);
router.put("/:id", NotificationController.update);
router.delete("/:id", NotificationController.delete);

router.get("/", NotificationController.getAll);
router.get("/:id", NotificationController.getById);

module.exports = router;