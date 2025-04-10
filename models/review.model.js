const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Review = sequelize.define("review", {
  rating: DataTypes.SMALLINT,
  comment: DataTypes.TEXT,
  created_at: DataTypes.DATE,
});

module.exports = Review;
