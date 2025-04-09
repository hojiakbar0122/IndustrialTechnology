const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Tech = require("./tech.model");

const Location = sequelize.define("location", {
  address: DataTypes.STRING,
  city: DataTypes.STRING,
  region: DataTypes.STRING,
  lat: DataTypes.DOUBLE,
  lng: DataTypes.DOUBLE,
});

// Tech.belongsTo(Location);
// Location.hasMany(Tech);

module.exports = Location;
