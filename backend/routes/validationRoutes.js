const express = require("express");
const router = express.Router();

const ValidationController = require("../controllers/ValidationController");

router.post("/", ValidationController.create);
router.put("/:id", ValidationController.update);
router.delete("/:id", ValidationController.delete);

router.get("/", ValidationController.getAll);
router.get("/:id", ValidationController.getById);

module.exports = router;