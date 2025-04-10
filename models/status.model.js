const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Status = sequelize.define("status", {
  name: DataTypes.STRING,
});

module.exports = Status;
