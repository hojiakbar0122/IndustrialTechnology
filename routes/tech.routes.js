const { addNewTech, getAllTechs, getTechById, updateTechById, deleteTechById } = require("../controllers/tech.controller");

const router = require("express").Router();

router.post("/", addNewTech);
router.get("/", getAllTechs);
router.get("/:id", getTechById);
router.put("/:id", updateTechById);
router.delete("/:id", deleteTechById);

module.exports = router;
