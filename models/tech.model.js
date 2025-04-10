const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Location = require("./location.model");
const Category = require("./category.model");
const Review = require("./review.model");
const Attachment = require("./attachment.model");

const Tech = sequelize.define("tech", {
  name: DataTypes.STRING,
  description: DataTypes.TEXT,
  price_per_hour: DataTypes.DECIMAL,
  status: DataTypes.ENUM("available", "unavailable"),
});

Review.belongsTo(Tech);
Tech.hasMany(Review);

Tech.hasMany(Attachment);
Attachment.belongsTo(Tech);

Tech.belongsTo(Category);
Category.hasMany(Tech);

Tech.belongsTo(Location);
Location.hasMany(Tech);

module.exports = Tech;
