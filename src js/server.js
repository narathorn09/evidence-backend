"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const express_1 = __importDefault(require("express"));
const port = config_1.default.get("app.port");
const app = (0, express_1.default)();
app.get("/", (req, res, next) => {
    res.send("Hello, Narathorn Nooasdphum");
});
app.listen(port, () => {
    console.log(`Rest API is now running on http://localhost:${port}`);
});
