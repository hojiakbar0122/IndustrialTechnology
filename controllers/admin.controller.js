const { errorHandler } = require("../helpers/error_handler");
const Admin = require("../models/admin.model");
const { adminValidation } = require("../validations/admin.validation");
const bcrypt = require("bcrypt");
const config = require("config");
const uuid = require("uuid");
const jwtService = require("../services/jwt.service");
const mailService = require("../services/mail.service");
const {
  passwordValidation,
} = require("../validations/resetPassword.validation");

const addNewAdmin = async (req, res) => {
  try {
    const { error, value } = adminValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    value.password = bcrypt.hashSync(value.password, 7);
    const activation_link = uuid.v4();

    const newAdmin = await Admin.create({
      ...value,
      activation_link,
    });

    await mailService.sendActivationMail(
      newAdmin.email,
      `${config.get("api_url")}/api/admins/activate/${activation_link}`
    );

    res.status(201).send({
      message: "Yangi admin qo'shildi. Aktivatsiya uchun email tekshiring",
      newAdmin,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll();
    res.status(200).send({ admins });
  } catch (error) {
    errorHandler(error, res);
  }
};

const getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).send({ message: "Admin topilmadi" });
    res.status(200).send({ admin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const updateAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const { error, value } = adminValidation(req.body);
    if (error) return res.status(400).send({ error: error.details });

    if (value.password) {
      value.password = bcrypt.hashSync(value.password, 7);
    }

    const [rows, [updatedAdmin]] = await Admin.update(value, {
      where: { id },
      returning: true,
    });

    if (!rows) return res.status(404).send({ message: "Admin topilmadi" });

    res.status(200).send({ message: "Admin yangilandi", admin: updatedAdmin });
  } catch (error) {
    errorHandler(error, res);
  }
};

const deleteAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Admin.destroy({ where: { id } });
    if (!deleted) return res.status(404).send({ message: "Admin topilmadi" });
    res.status(200).send({ message: "Admin o'chirildi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ where: { email } });

    if (!admin)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });

    const validPassword = bcrypt.compareSync(password, admin.password);
    if (!validPassword)
      return res.status(400).send({ message: "Email yoki parol noto'g'ri" });

    const payload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const tokens = jwtService.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    const { refresh_cookie_time } = jwtService.getUserConfig(admin.role);
    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      maxAge: refresh_cookie_time,
    });

    res.send({
      message: "Tizimga xush kelibsiz",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

const logoutAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).send({ message: "Cookie da token topilmadi" });

    const admin = await Admin.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!admin)
      return res.status(400).send({ message: "Tokenli admin topilmadi" });

    admin.refresh_token = null;
    await admin.save();

    res.clearCookie("refreshToken");
    res.send({ message: "Chiqish muvaffaqiyatli bo‘ldi" });
  } catch (error) {
    errorHandler(error, res);
  }
};

const refreshTokenAdmin = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken)
      return res.status(400).send({ message: "Cookie da token topilmadi" });

    const admin = await Admin.findOne({
      where: { refresh_token: refreshToken },
    });
    if (!admin)
      return res.status(400).send({ message: "Tokenli admin topilmadi" });

    const payload = {
      id: admin.id,
      email: admin.email,
      role: admin.role,
    };

    const tokens = jwtService.generateTokens(payload);
    admin.refresh_token = tokens.refreshToken;
    await admin.save();

    const { refresh_cookie_time } = jwtService.getUserConfig(admin.role);
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

const activateAdmin = async (req, res) => {
  try {
    const admin = await Admin.findOne({
      where: { activation_link: req.params.link },
    });
    if (!admin) return res.status(404).send({ message: "Admin topilmadi" });

    admin.is_active = true;
    await admin.save();

    res.send({
      message: "Admin faollashtirildi",
      status: admin.is_active,
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

    const admin = await Admin.findByPk(id);
    if (!admin) return res.status(404).send({ message: "Admin topilmadi" });

    const isMatch = bcrypt.compareSync(oldPassword, admin.password);
    if (!isMatch) {
      return res.status(400).send({ error: "Eski parol noto'g'ri" });
    }

    const hashedPassword = bcrypt.hashSync(value.password, 7);

    const [rows, [updatedAdmin]] = await Admin.update(
      { password: hashedPassword },
      {
        where: { id },
        returning: true,
      }
    );

    res.status(200).send({
      message: "Parol muvaffaqiyatli yangilandi",
      admin: updatedAdmin,
    });
  } catch (error) {
    errorHandler(error, res);
  }
};

module.exports = {
  addNewAdmin,
  getAllAdmins,
  getAdminById,
  updateAdminById,
  deleteAdminById,
  loginAdmin,
  logoutAdmin,
  refreshTokenAdmin,
  activateAdmin,
  resetPasswordById,
};
