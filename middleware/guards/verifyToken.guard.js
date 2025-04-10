const { errorHandler } = require("../../helpers/error_handler");
const jwtService = require("../../services/jwt.service");

module.exports = async function (req, res, next) {
  try {
    const authorization = req.headers.authorization;
    if (!authorization) {
      return res
        .status(401)
        .send({ message: "authorization token berilmagan" });
    }
    const [bearer, token] = authorization.split(" ");
    if (bearer != "Bearer" || !token) {
      return res.status(401).send({ message: "Bearer yoki token berilmagan" });
    }
    const dekodedToken = await jwtService.verifyAccessToken(token);
    req.user = dekodedToken;

    next();
  } catch (error) {
    errorHandler(error, res);
  }
};
