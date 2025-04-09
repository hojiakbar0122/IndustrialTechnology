const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Contract = require("./contract.model");

const Status = sequelize.define("status", {
  name: DataTypes.STRING,
});

module.exports = Status;
