const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const PassportData = sequelize.define("passport_data", {
  given_date: DataTypes.DATE,
  born_date: DataTypes.DATE,
  issued_by: DataTypes.TEXT,
  seria: DataTypes.STRING
});

module.exports = PassportData;
