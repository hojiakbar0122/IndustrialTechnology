module.exports = (req, res, next) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).send({ message: "Admin kirishi kerak!" });
    }
    next();
  } catch (err) {
    res.status(401).send({ message: "Token not valid" });
  }
};
