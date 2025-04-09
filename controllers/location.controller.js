const { errorHandler } = require("../helpers/error_handler");
const Location = require("../models/location.model");
const { locationValidation } = require("../validations/location.validation");

const addNewLocation = async (req, res) => {
  try {
    const { error, value } = locationValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const location = await Location.create(value);
    res.status(201).send({ message: "New location added", location });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.status(200).send({ locations });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    const location = await Location.findByPk(id);
    res.status(200).send({ location });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateLocationById = async (req, res) => {
  try {
    const { error, value } = locationValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const { id } = req.params;
    const updatedLocation = await Location.update(value, {
      where: { id },
      returning: true,
    });
    res.status(200).send({ location: updatedLocation[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteLocationById = async (req, res) => {
  try {
    const { id } = req.params;
    await Location.destroy({ where: { id } });
    res.status(200).send({ message: "Location deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewLocation,
  getAllLocations,
  getLocationById,
  updateLocationById,
  deleteLocationById,
};
