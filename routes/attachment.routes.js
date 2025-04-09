const { addNewAttachment, deleteAttachmentById, updateAttachmentById, getAttachmentById, getAllAttachments } = require("../controllers/attachment.controller");

const router = require("express").Router();

router.post("/", addNewAttachment);
router.get("/", getAllAttachments);
router.get("/:id", getAttachmentById);
router.put("/:id", updateAttachmentById);
router.delete("/:id", deleteAttachmentById);

module.exports = router;
