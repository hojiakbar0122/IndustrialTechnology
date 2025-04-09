const { errorHandler } = require("../helpers/error_handler");
const Category = require("../models/category.model");
const Client = require("../models/client.model");
const Contract = require("../models/contract.model");
const Location = require("../models/location.model");
const Owner = require("../models/owner.model");
const Payment = require("../models/payment.model");
const Tech = require("../models/tech.model");
const { paymentValidation } = require("../validations/payment.validation");

const addNewPayment = async (req, res) => {
  try {
    const { error, value } = paymentValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const payment = await Payment.create(value);
    res.status(201).send({ message: "New payment added", payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: Contract,
          include: [
            { model: Client },
            { model: Owner },
            {
              model: Tech,
              include: [
                { model: Owner },
                { model: Location },
                { model: Category },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).send({ payments });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getPaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByPk(id);
    res.status(200).send({ payment });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updatePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = paymentValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    const updated = await Payment.update(value, {
      where: { id },
      returning: true,
    });
    res.status(200).send({ payment: updated[1][0] });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deletePaymentById = async (req, res) => {
  try {
    const { id } = req.params;
    await Payment.destroy({ where: { id } });
    res.status(200).send({ message: "Payment deleted" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClientPayments = async (req, res) => {
  try {
    const { clientId } = req.body;

    const payments = await Payment.findAll({
      include: [
        {
          model: Contract,
          where: { clientId: clientId },
          include: [
            {
              model: Tech,
              include: [
                { model: Category, attributes: ["id", "name"] },
                { model: Owner, attributes: ["id", "company_name"] },
              ],
            },
          ],
        },
      ],
    });

    res.status(200).send({ payments });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewPayment,
  getAllPayments,
  getPaymentById,
  updatePaymentById,
  deletePaymentById,
  getClientPayments,
};
