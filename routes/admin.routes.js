const {
  addNewAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  activateAdmin,
  loginAdmin,
  logoutAdmin,
  refreshTokenAdmin,
  resetPasswordById,
} = require("../controllers/admin.controller");
const isSuperAdmin = require("../middleware/guards/isSuperAdmin.guard");
const isAdmin = require("../middleware/guards/isAdmin.guard");
const verifyToken = require("../middleware/guards/verifyToken.guard");
const router = require("express").Router();

router.post("/", verifyToken, isSuperAdmin, addNewAdmin);
router.post("/login", loginAdmin);
router.post("/logout", logoutAdmin);
router.post("/refreshtoken", refreshTokenAdmin);
router.post("/resetpassword/:id", verifyToken, isAdmin, resetPasswordById);

router.get("/", verifyToken, isSuperAdmin, getAllAdmins);
router.get("/activate/:link", activateAdmin);
router.get("/:id", verifyToken, isAdmin, getAdminById);
router.put("/:id", verifyToken, isAdmin, updateAdminById);
router.delete("/:id", verifyToken, isAdmin, deleteAdminById);

module.exports = router;
