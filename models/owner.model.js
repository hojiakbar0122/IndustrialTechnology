const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Tech = require("./tech.model");

const Owner = sequelize.define("owner", {
  company_name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  phone: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  address: DataTypes.STRING,
  role: {
    type: DataTypes.STRING,
    defaultValue: "owner",
    allowNull: false
  },  
  registered_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  refresh_token: DataTypes.STRING,
  is_active: { type: DataTypes.BOOLEAN},
  activation_link:{type:DataTypes.STRING}
});

Tech.belongsTo(Owner);
Owner.hasMany(Tech);

module.exports = Owner;
