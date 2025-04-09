const { errorHandler } = require("../helpers/error_handler");
const Category = require("../models/category.model");
const { categoryValidation } = require("../validations/category.validation");

const addNewCategory = async (req, res) => {
  try {
    const { error, value } = categoryValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const category = await Category.create(value);
    res.status(201).send({ message: "New category added", category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.status(200).send({ categories });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    res.status(200).send({ category });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = categoryValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const updatedCategory = await Category.update(value, {
      where: { id },
      returning: true,
    });
    res.status(200).send({ category: updatedCategory[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    await Category.destroy({ where: { id } });
    res.status(200).send({ message: "Category deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewCategory,
  getAllCategories,
  getCategoryById,
  updateCategoryById,
  deleteCategoryById,
};
