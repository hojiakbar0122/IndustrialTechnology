const { errorHandler } = require("../helpers/error_handler");
const Client = require("../models/client.model");
const PassportData = require("../models/passport_data.model");
const { passportValidation } = require("../validations/passport.validation");

const addNewPassportData = async (req, res) => {
  try {
    const { error, value } = passportValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const passportData = await PassportData.create(value);
    res.status(201).send({ message: "New passport data added", passportData });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllPassportDatas = async (req, res) => {
  try {
    const passportDatas = await PassportData.findAll({include: Client});
    res.status(200).send({ passportDatas });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getPassportDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const passportData = await PassportData.findByPk(id);
    res.status(200).send({ passportData });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updatePassportDataById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = passportValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const updated = await PassportData.update(value, {
      where: { id },
      returning: true,
    });
    res.status(200).send({ passportData: updated[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deletePassportDataById = async (req, res) => {
  try {
    const { id } = req.params;
    await PassportData.destroy({ where: { id } });
    res.status(200).send({ message: "Passport data deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewPassportData,
  getAllPassportDatas,
  getPassportDataById,
  updatePassportDataById,
  deletePassportDataById,
};
