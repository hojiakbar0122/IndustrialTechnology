const { addNewClient, getAllClients, getClientById, updateClientById, deleteClientById, loginClient, logoutClient, refreshTokenClient, activateClient, resetPasswordById } = require("../controllers/client.controller");
const isAdmin = require("../middleware/guards/isAdmin.guard");
const isClient = require("../middleware/guards/isClient.guard");
const verifyToken = require("../middleware/guards/verifyToken.guard")
const router = require("express").Router()

router.post("/", addNewClient)
router.post("/login", loginClient);
router.post("/logout", verifyToken, isClient, logoutClient);
router.post("/refreshtoken", refreshTokenClient);
router.post("/resetpassword/:id", verifyToken, isClient, resetPasswordById);

router.get("/", verifyToken, isAdmin, getAllClients)
router.get("/activate/:link", activateClient);
router.get("/:id", verifyToken, isClient, getClientById)
router.put("/:id", verifyToken, isClient, updateClientById)
router.delete("/:id", verifyToken, isClient, deleteClientById)

module.exports = router