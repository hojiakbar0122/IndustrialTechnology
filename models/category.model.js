const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Tech = require("./tech.model");

const Category = sequelize.define("category", {
  name: DataTypes.STRING,
  description: DataTypes.STRING,
});

// Tech.belongsTo(Category);
// Category.hasMany(Tech);

module.exports = Category;
