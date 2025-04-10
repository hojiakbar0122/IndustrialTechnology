const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Category = sequelize.define("category", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});

module.exports = Category;
