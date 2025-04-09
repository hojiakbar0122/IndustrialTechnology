const { errorHandler } = require("../helpers/error_handler");
const Client = require("../models/client.model");
const { clientValidation } = require("../validations/client.validation");
const bcrypt = require("bcrypt");
const config = require("config");
const uuid = require("uuid");
const jwtService = require("../services/jwt.service");
const mailService = require("../services/mail.service");
const { passwordValidation } = require("../validations/resetPassword.validation");

const addNewClient = async (req, res) => {
  try {
    const { error, value } = clientValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    value.password = bcrypt.hashSync(value.password, 7);
    const activation_link = uuid.v4();

    const newClient = await Client.create({ ...value, activation_link });

    await mailService.sendActivationMail(
      newClient.email,
      `${config.get("api_url")}/api/clients/activate/${activation_link}`
    );

    res.status(201).send({
      message: "Client ro'yxatdan o'tdi. Email orqali tasdiqlang",
      newClient,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllClients = async (req, res) => {
  try {
    const clients = await Client.findAll();
    res.status(200).send({ clients });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) return res.status(404).send({ message: "Client topilmadi" });
    res.status(200).send({ client });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateClientById = async (req, res) => {
  try {
    const { error, value } = clientValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    if (value.password) value.password = bcrypt.hashSync(value.password, 7);

    const [rows, [updatedClient]] = await Client.update(value, {
      where: { id: req.params.id },
      returning: true,
    });
    if (rows === 0) return res.status(404).send({ message: "Client topilmadi" });
    res.status(200).send({ message: "Client yangilandi", client: updatedClient });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteClientById = async (req, res) => {
  try {
    const deleted = await Client.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).send({ message: "Client topilmadi" });
    res.status(200).send({ message: "Client o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginClient = async (req, res) => {
  try {
    const { email, password } = req.body;
    const client = await Client.findOne({ where: { email } });
    if (!client) return res.status(400).send({ message: "Login yoki parol noto'g'ri" });

    const isValid = bcrypt.compareSync(password, client.password);
    if (!isValid) return res.status(400).send({ message: "Login yoki parol noto'g'ri" });

    const tokens = jwtService.generateTokens({
      id: client.id,
      email: client.email,
      role: client.role,
    });

    client.refresh_token = tokens.refreshToken;
    await client.save();

    const {refresh_cookie_time} = jwtService.getUserConfig(client.role)
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: refresh_cookie_time,
    });

    res.send({ message: "Xush kelibsiz", accessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutClient = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(400).send({ message: "Token topilmadi" });

    const client = await Client.findOne({ where: { refresh_token: refreshToken } });
    if (!client) return res.status(400).send({ message: "Client topilmadi" });

    client.refresh_token = null;
    await client.save();

    res.clearCookie("refreshToken");
    res.send({ message: "Chiqildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenClient = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) return res.status(400).send({ message: "Token topilmadi" });

    const client = await Client.findOne({ where: { refresh_token: refreshToken } });
    if (!client) return res.status(400).send({ message: "Client topilmadi" });

    const tokens = jwtService.generateTokens({
      id: client.id,
      email: client.email,
      role: client.role,
    });

    client.refresh_token = tokens.refreshToken;
    await client.save();

    const {refresh_cookie_time} = jwtService.getUserConfig(client.role)
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: refresh_cookie_time,
    });

    res.send({ message: "Yangilandi", accessToken: tokens.accessToken });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateClient = async (req, res) => {
  try {
    const client = await Client.findOne({ where: { activation_link: req.params.link } });
    if (!client) return res.status(404).send({ message: "Topilmadi" });

    client.is_active = true;
    await client.save();

    res.send({ message: "Faollashtirildi", status: true });
  } catch (error) {
    errorHandler(error, res);
  }
};

const resetPasswordById = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, password, confirm_password } = req.body;

    const { error, value } = passwordValidation({ password, confirm_password });
    if (error) return res.status(400).send({ error: error.details });

    const client = await Client.findByPk(id);
    if (!client) return res.status(404).send({ message: "Client topilmadi" });

    const isMatch = bcrypt.compareSync(oldPassword, client.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Eski parol noto'g'ri" });
    }

    const hashedPassword = bcrypt.hashSync(value.password, 7);

    const [rows, [updatedClient]] = await Client.update(
      { password: hashedPassword },
      {
        where: { id },
        returning: true,
      }
    );

    res.status(200).send({
      message: "Parol muvaffaqiyatli yangilandi",
      client: updatedClient,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewClient,
  getAllClients,
  getClientById,
  updateClientById,
  deleteClientById,
  loginClient,
  logoutClient,
  refreshTokenClient,
  activateClient,
  resetPasswordById
};
