const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Tech = require("./tech.model");

const Attachment = sequelize.define("attachment", {
  file_url: DataTypes.STRING,
  type: DataTypes.STRING,
  uploaded_at: DataTypes.DATE,
});

module.exports = Attachment;
