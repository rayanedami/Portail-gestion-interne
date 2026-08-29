const express = require("express");
const router = express.Router();

const LogController = require("../controllers/LogController");

router.post("/", LogController.create);
router.put("/:id", LogController.update);
router.delete("/:id", LogController.delete);

router.get("/", LogController.getAll);
router.get("/:id", LogController.getById);

module.exports = router;