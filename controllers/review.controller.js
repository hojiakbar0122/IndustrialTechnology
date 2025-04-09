const { errorHandler } = require("../helpers/error_handler");
const Category = require("../models/category.model");
const Client = require("../models/client.model");
const Location = require("../models/location.model");
const Owner = require("../models/owner.model");
const Review = require("../models/review.model");
const Tech = require("../models/tech.model");
const { reviewValidation } = require("../validations/review.validation");

const addNewReview = async (req, res) => {
  try {
    const { error, value } = reviewValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const review = await Review.create(value);
    res.status(201).send({ message: "New review added", review });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.findAll({
      include: [
        { model: Client },
        { 
          model: Tech,
          include: [
            { model: Owner },
            { model: Location },
            { model: Category }
          ]
        }
      ]
    });
    res.status(200).send({ reviews });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findByPk(id);
    res.status(200).send({ review });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = reviewValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const updated = await Review.update(value, { where: { id }, returning: true });
    res.status(200).send({ review: updated[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    await Review.destroy({ where: { id } });
    res.status(200).send({ message: "Review deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewReview,
  getAllReviews,
  getReviewById,
  updateReviewById,
  deleteReviewById,
};
