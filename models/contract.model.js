const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Client = require("./client.model");
const Owner = require("./owner.model");
const Tech = require("./tech.model");
const Status = require("./status.model");
const Payment = require("./payment.model");

const Contract = sequelize.define("contract", {
  start_date: DataTypes.DATE,
  end_date: DataTypes.DATE,
  price: DataTypes.DECIMAL,
  created_at: DataTypes.DATE,
  is_damaged:DataTypes.BOOLEAN,
  damage_note:DataTypes.TEXT
});

Payment.belongsTo(Contract);
Contract.hasMany(Payment);

Contract.belongsTo(Tech);
Tech.hasMany(Contract);

Contract.belongsTo(Owner);
Owner.hasMany(Contract);

Contract.belongsTo(Status);
Status.hasMany(Contract);

module.exports = Contract;
