const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Location = sequelize.define("location", {
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  region: DataTypes.STRING,
  lat: DataTypes.DOUBLE,
  lng: DataTypes.DOUBLE,
});

module.exports = Location;
