const { addNewOwner, getAllOwners, getOwnerById, updateOwnerById, deleteOwnerById, loginOwner, logoutOwner, refreshTokenOwner, activateOwner, getTopOwnersByCategory, resetPasswordById } = require("../controllers/owner.controller");
const isAdmin = require("../middleware/guards/isAdmin.guard");
const isOwner = require("../middleware/guards/isOwner.guard");
const verifyToken = require("../middleware/guards/verifyToken.guard")

const router = require("express").Router();

router.post("/", verifyToken, isAdmin, addNewOwner);
router.post("/login", loginOwner);
router.post("/logout", verifyToken, isOwner, logoutOwner);
router.post("/refreshtoken", refreshTokenOwner);
router.post("/resetpassword/:id", verifyToken, isOwner, resetPasswordById);

router.get("/", verifyToken, isAdmin, getAllOwners);
router.get("/activate/:link", activateOwner);
router.get("/:id", verifyToken, isOwner, getOwnerById);
router.put("/:id", verifyToken, isOwner, updateOwnerById);
router.delete("/:id", verifyToken, isOwner, deleteOwnerById);

module.exports = router;
