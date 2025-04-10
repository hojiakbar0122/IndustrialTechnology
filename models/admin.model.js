const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Admin = sequelize.define("admin", {
  name: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING, unique: true },
  phone: { type: DataTypes.STRING, unique: true},
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.ENUM("superadmin", "admin") },
  refresh_token: { type: DataTypes.STRING },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: false },
  activation_link:{type:DataTypes.STRING}
});

module.exports = Admin;
