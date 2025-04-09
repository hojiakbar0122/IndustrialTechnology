const Contract = require("../models/contract.model");
const { Op, Sequelize } = require("sequelize");
const Tech = require("../models/tech.model");
const Client = require("../models/client.model");
const Owner = require("../models/owner.model");
const { errorHandler } = require("../helpers/error_handler");
const { contractValidation } = require("../validations/contract.validation");
const Location = require("../models/location.model");
const Category = require("../models/category.model");

const addNewContract = async (req, res) => {
  try {
    const { error, value } = contractValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const newContract = await Contract.create(value);
    res.status(201).send({ message: "New contract added", newContract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllContracts = async (req, res) => {
  try {
    const contracts = await Contract.findAll({
      include: [
        { model: Client },
        { model: Owner },
        {
          model: Tech,
          include: [{ model: Owner }, { model: Location }, { model: Category }],
        },
      ],
    });
    res.status(200).send({ contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const contract = await Contract.findByPk(id);
    res.status(200).send({ contract });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateContractById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = contractValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const updatedContract = await Contract.update(value, {
      where: { id },
      returning: true,
    });
    res.status(200).send({ contract: updatedContract[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteContractById = async (req, res) => {
  try {
    const { id } = req.params;
    await Contract.destroy({ where: { id } });
    res.status(200).send({ message: "Contract deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getRentedTechsByDateRange = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const contracts = await Contract.findAll({
      where: {
        [Op.and]: [
          { start_date: { [Op.lte]: endDate } },
          { end_date: { [Op.gte]: startDate } },
        ],
      },
      include: [
        {
          model: Tech,
          attributes: ["id", "name", "description", "price_per_hour"],
        },
      ],
    });

    res.status(200).send({ rented_techs: contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getDamagedTechClientsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const contracts = await Contract.findAll({
      where: {
        is_damaged: true,
        [Op.and]: [
          { start_date: { [Op.lte]: endDate } },
          { end_date: { [Op.gte]: startDate } },
        ],
      },
      include: [
        {
          model: Client,
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });

    res.status(200).send({ cancelled_orders: contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getCancelledContractClientsByDate = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    const contracts = await Contract.findAll({
      where: {
        statusId: 2,
        created_at: { [Op.between]: [startDate, endDate] },
      },
      include: [
        {
          model: Client,
          attributes: ["id", "first_name", "last_name", "email"],
        },
      ],
    });

    res.status(200).send({ cancelled_orders: contracts });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewContract,
  getAllContracts,
  getContractById,
  updateContractById,
  deleteContractById,
  getRentedTechsByDateRange,
  getDamagedTechClientsByDate,
  getCancelledContractClientsByDate,
};
