const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Contract = require("./contract.model");
const Review = require("./review.model");
const PassportData = require("./passport_data.model");

const Client = sequelize.define("client", {
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true },
  phone: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  address: { type: DataTypes.STRING },
  registered_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  role: {
    type: DataTypes.STRING,
    defaultValue: "client",
    allowNull: false
  },
  refresh_token: { type: DataTypes.STRING },
  is_active: { type: DataTypes.BOOLEAN },
  activation_link:{type:DataTypes.STRING}
});

Review.belongsTo(Client);
Client.hasMany(Review);

Contract.belongsTo(Client);
Client.hasMany(Contract);

PassportData.belongsTo(Client);
Client.hasOne(PassportData);

module.exports = Client;
