const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Client = require("./client.model");
const Tech = require("./tech.model");

const Review = sequelize.define("review", {
  rating: DataTypes.SMALLINT,
  comment: DataTypes.TEXT,
  created_at: DataTypes.DATE,
});

module.exports = Review;
