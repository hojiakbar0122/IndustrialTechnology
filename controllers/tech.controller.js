const { errorHandler } = require("../helpers/error_handler");
const Category = require("../models/category.model");
const Location = require("../models/location.model");
const Owner = require("../models/owner.model");
const Tech = require("../models/tech.model");
const { techValidation } = require("../validations/tech.validation");

const addNewTech = async (req, res) => {
  try {
    const { error, value } = techValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const newTech = await Tech.create(value);
    res.status(201).send({ message: "New tech added", newTech });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllTechs = async (req, res) => {
  try {
    const techs = await Tech.findAll({include:[Location, Owner, Category]});
    res.status(200).send({ techs });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getTechById = async (req, res) => {
  try {
    const { id } = req.params;
    const tech = await Tech.findByPk(id);
    res.status(200).send({ tech });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateTechById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = techalidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const updatedTech = await Tech.update(value, { where: { id }, returning: true });
    res.status(200).send({ tech: updatedTech[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteTechById = async (req, res) => {
  try {
    const { id } = req.params;
    await Tech.destroy({ where: { id } });
    res.status(200).send({ message: "Tech deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewTech,
  getAllTechs,
  getTechById,
  updateTechById,
  deleteTechById
};
