const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Contract = require("./contract.model");
const Tech = require("./tech.model");

const Owner = sequelize.define("owner", {
  company_name: DataTypes.STRING,
  email: DataTypes.STRING,
  phone: DataTypes.STRING,
  password: DataTypes.STRING,
  address: DataTypes.STRING,
  role: {
    type: DataTypes.STRING,
    defaultValue: "owner",
    allowNull: false
  },  
  registered_at: DataTypes.DATE,
  refresh_token: DataTypes.STRING,
  is_active: { type: DataTypes.BOOLEAN},
  activation_link:{type:DataTypes.STRING}
});

Tech.belongsTo(Owner);
Owner.hasMany(Tech);

module.exports = Owner;
