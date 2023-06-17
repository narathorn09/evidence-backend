"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtSign = void 0;
const { jwt: { secret }, } = require("config");
const jwt = require("jsonwebtoken");
const jwtSign = (payload, expiresIn = "2m") => jwt.sign(payload, secret, { expiresIn });
exports.jwtSign = jwtSign;
