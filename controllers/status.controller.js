const { errorHandler } = require("../helpers/error_handler");
const Status = require("../models/status.model");
const { statusValidation } = require("../validations/status.validation");

const addNewStatus = async (req, res) => {
  try {
    const { error, value } = statusValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const status = await Status.create(value);
    res.status(201).send({ message: "New status added", status });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllStatuses = async (req, res) => {
  try {
    const statuses = await Status.findAll();
    res.status(200).send({ statuses });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const status = await Status.findByPk(id);
    res.status(200).send({ status });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = statusValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const updatedStatus = await Status.update(value, { where: { id }, returning: true });
    res.status(200).send({ status: updatedStatus[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteStatusById = async (req, res) => {
  try {
    const { id } = req.params;
    await Status.destroy({ where: { id } });
    res.status(200).send({ message: "Status deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewStatus,
  getAllStatuses,
  getStatusById,
  updateStatusById,
  deleteStatusById,
};
