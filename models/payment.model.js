const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Contract = require("./contract.model");

const Payment = sequelize.define("payment", {
  amount: DataTypes.DECIMAL,
  paid_at: DataTypes.DATE,
  method: DataTypes.STRING,
  status: DataTypes.ENUM("pending", "paid", "failed"),
});

module.exports = Payment;
