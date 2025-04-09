const { addNewLocation, getAllLocations, getLocationById, updateLocationById, deleteLocationById } = require("../controllers/location.controller");

const router = require("express").Router();

router.post("/", addNewLocation);
router.get("/", getAllLocations);
router.get("/:id", getLocationById);
router.put("/:id", updateLocationById);
router.delete("/:id", deleteLocationById);

module.exports = router;
