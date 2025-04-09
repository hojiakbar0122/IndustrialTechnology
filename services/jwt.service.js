const config = require("config");
const jwt = require("jsonwebtoken");

class JwtService {
  constructor() {
    this.jwtConfig = config.get("jwt");
  }

  getUserConfig(userType) {
    const userConfig = this.jwtConfig[userType];
    if (!userConfig) {
      throw new Error(`JWT config not found for user type: ${userType}`);
    }
    return userConfig;
  }

  generateTokens(payload) {
    const userType = payload.role;
    if (!userType) {
      throw new Error("Payload must include user role (admin, client, owner)");
    }

    const { access_key, refresh_key, access_time, refresh_time } = this.getUserConfig(userType);

    const accessToken = jwt.sign(payload, access_key, { expiresIn: access_time });
    const refreshToken = jwt.sign(payload, refresh_key, { expiresIn: refresh_time });

    return {
      accessToken,
      refreshToken
    };
  }

  async verifyAccessToken(token) {
    const decoded = jwt.decode(token);
    if (!decoded?.role) {
      throw new Error("Invalid token: role not found");
    }

    const { access_key } = this.getUserConfig(decoded.role);
    return jwt.verify(token, access_key);
  }

  async verifyRefreshToken(token) {
    const decoded = jwt.decode(token);
    if (!decoded?.role) {
      throw new Error("Invalid token: role not found");
    }

    const { refresh_key } = this.getUserConfig(decoded.role);
    return jwt.verify(token, refresh_key);
  }
}

module.exports = new JwtService();
