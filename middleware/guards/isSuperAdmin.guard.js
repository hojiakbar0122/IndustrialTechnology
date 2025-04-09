const { errorHandler } = require("../../helpers/error_handler");

module.exports = async function (req, res, next) {
  try {

    if (req.user.role !== "superadmin") {
      return res.status(403).send({ message: "Ruxsat yo'q (admin emas)" });
    }

    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
