module.exports = async function (req, res, next) {
  try {

    if (req.user.role !== "superadmin") {
      return res.status(403).send({ message: "Ruxsat yo'q (admin emas)" });
    }

    next();
  } catch (error) {
    res.status(401).send({ message: "Token not valid" });
  }
};
