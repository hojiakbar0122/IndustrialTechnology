const { addNewStatus, getAllStatuses, getStatusById, updateStatusById, deleteStatusById } = require("../controllers/status.controller");

const router = require("express").Router();

router.post("/", addNewStatus);
router.get("/", getAllStatuses);
router.get("/:id", getStatusById);
router.put("/:id", updateStatusById);
router.delete("/:id", deleteStatusById);

module.exports = router;
