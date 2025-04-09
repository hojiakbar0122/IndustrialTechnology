const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Client = require("./client.model");

const PassportData = sequelize.define("passport_data", {
  given_date: DataTypes.DATE,
  born_date: DataTypes.DATE,
  issued_by: DataTypes.TEXT,
  seria: DataTypes.STRING
});

// PassportData.belongsTo(Client);
// Client.hasOne(PassportData);

module.exports = PassportData;
