const { errorHandler } = require("../helpers/error_handler");
const Attachment = require("../models/attachment.model");
const Category = require("../models/category.model");
const Location = require("../models/location.model");
const Owner = require("../models/owner.model");
const Tech = require("../models/tech.model");
const { attachmentValidation } = require("../validations/attachment.validation");

const addNewAttachment = async (req, res) => {
  try {
    const { error, value } = attachmentValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const attachment = await Attachment.create(value);
    res.status(201).send({ message: "New attachment added", attachment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllAttachments = async (req, res) => {
  try {
    const attachments = await Attachment.findAll({
      include: {
        model: Tech,
        include: [
          { model: Owner },
          { model: Location },
          { model: Category }
        ]
      }
    });
    res.status(200).send({ attachments });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAttachmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const attachment = await Attachment.findByPk();
    res.status(200).send({ attachment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAttachmentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = attachmentValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const updatedAttachment = await Attachment.update(value, {
      where: { id },
      returning: true,
    });
    res.status(200).send({ attachment: updatedAttachment[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAttachmentById = async (req, res) => {
  try {
    const { id } = req.params;
    await Attachment.destroy({ where: { id } });
    res.status(200).send({ message: "Attachment deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewAttachment,
  getAllAttachments,
  getAttachmentById,
  updateAttachmentById,
  deleteAttachmentById,
};
