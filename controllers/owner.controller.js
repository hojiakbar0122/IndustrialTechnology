const { errorHandler } = require("../helpers/error_handler");
const Owner = require("../models/owner.model");
const bcrypt = require("bcrypt");
const config = require("config");
const uuid = require("uuid");
const jwtService = require("../services/jwt.service");
const mailService = require("../services/mail.service");
const Tech = require("../models/tech.model");
const { ownerValidation } = require("../validations/owner.validation");
const {
  passwordValidation,
} = require("../validations/resetPassword.validation");

const addNewOwner = async (req, res) => {
  try {
    const { error, value } = ownerValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    value.password = bcrypt.hashSync(value.password, 7);
    const activation_link = uuid.v4();

    const newOwner = await Owner.create({
      ...value,
      activation_link,
    });

    await mailService.sendActivationMail(
      newOwner.email,
      `${config.get("api_url")}/api/owners/activate/${activation_link}`
    );

    res.status(201).send({
      message:
        "Yangi owner qo'shildi. Akkountni faollashtirish uchun emailingizni tekshiring.",
      newOwner,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllOwners = async (req, res) => {
  try {
    const owners = await Owner.findAll();
    res.status(200).send({ owners });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const owner = await Owner.findByPk(id);
    if (!owner) return res.status(404).send({ message: "Owner topilmadi" });
    res.status(200).send({ owner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateOwnerById = async (req, res) => {
  try {
    const id = req.params.id;
    const { error, value } = ownerValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    if (value.password) {
      value.password = bcrypt.hashSync(password, 7);
    }

    const [rows, [updatedOwner]] = await Owner.update(value, {
      where: { id },
      returning: true,
    });

    if (rows === 0) return res.status(404).send({ message: "Owner topilmadi" });
    res.status(200).send({ message: "Owner yangilandi", owner: updatedOwner });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteOwnerById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Owner.destroy({ where: { id } });
    if (!deleted) return res.status(404).send({ message: "Owner topilmadi" });
    res.status(200).send({ message: "Owner o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginOwner = async (req, res) => {
  try {
    const { email, password } = req.body;
    const owner = await Owner.findOne({ where: { email } });

    if (!owner) {
      return res.status(400).send({ message: "Email yoki parol noto‘g‘ri" });
    }

    const validPassword = bcrypt.compareSync(password, owner.password);
    if (!validPassword) {
      return res.status(400).send({ message: "Email yoki parol noto‘g‘ri" });
    }

    const payload = {
      id: owner.id,
      email: owner.email,
      role: owner.role,
    };
    const tokens = jwtService.generateTokens(payload);

    owner.refresh_token = tokens.refreshToken;
    await owner.save();

    const { refresh_cookie_time } = jwtService.getUserConfig(owner.role);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: refresh_cookie_time,
    });

    res.send({
      message: "Tizimga muvaffaqiyatli kirdingiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutOwner = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Refresh token topilmadi" });
    }

    const owner = await Owner.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!owner) {
      return res.status(400).send({ message: "Tokenli owner topilmadi" });
    }

    owner.refresh_token = null;
    await owner.save();

    res.clearCookie("refreshToken");
    res.send({ message: "Owner tizimdan chiqdi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenOwner = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      return res.status(400).send({ message: "Refresh token mavjud emas" });
    }

    const owner = await Owner.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!owner) {
      return res.status(400).send({ message: "Tokenli owner topilmadi" });
    }

    const payload = {
      id: owner.id,
      email: owner.email,
      role: owner.role,
    };

    const tokens = jwtService.generateTokens(payload);
    owner.refresh_token = tokens.refreshToken;
    await owner.save();

    const { refresh_cookie_time } = jwtService.getUserConfig(owner.role);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: refresh_cookie_time,
    });

    res.send({
      message: "Tokenlar yangilandi",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const activateOwner = async (req, res) => {
  try {
    const owner = await Owner.findOne({
      where: { activation_link: req.params.link },
    });

    if (!owner) {
      return res.status(404).send({ message: "Owner topilmadi" });
    }

    owner.is_active = true;
    await owner.save();

    res.send({
      message: "Owner muvaffaqiyatli faollashtirildi",
      status: owner.is_active,
    });
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

    const owner = await Owner.findByPk(id);
    if (!owner) return res.status(404).send({ message: "Owner topilmadi" });

    const isMatch = bcrypt.compareSync(oldPassword, owner.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Eski parol noto'g'ri" });
    }

    const hashedPassword = bcrypt.hashSync(value.password, 7);

    const [rows, [updatedOwner]] = await Owner.update(
      { password: hashedPassword },
      {
        where: { id },
        returning: true,
      }
    );

    res.status(200).send({
      message: "Parol muvaffaqiyatli yangilandi",
      owner: updatedOwner,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewOwner,
  getAllOwners,
  getOwnerById,
  updateOwnerById,
  deleteOwnerById,
  loginOwner,
  logoutOwner,
  refreshTokenOwner,
  activateOwner,
  resetPasswordById,
};
