const {
  jwt: { secret },
} = require("config");
const jwt = require("jsonwebtoken");

export const jwtSign = (payload: any, expiresIn = "2m") => jwt.sign(payload, secret, { expiresIn });
