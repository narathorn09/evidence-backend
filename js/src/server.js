"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const corsOptions_1 = require("../config/corsOptions");
const credentials_1 = require("./middleware/credentials");
const routerv1_1 = __importDefault(require("./router/routerv1"));
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const cors = require("cors");
const { server: { port }, } = require("config");
const app = (0, express_1.default)();
app.use(credentials_1.credentials);
app.use(cors(corsOptions_1.corsOptions));
// app.use(express.urlencoded({extended: true }));
app.use(express_1.default.json());
app.use(cookieParser());
app.get("/", (req, res, next) => {
    res.send("Hello, API For Express & MySQL");
});
app.use("/api/v1/", routerv1_1.default);
const httpServer = (0, http_1.createServer)(app);
httpServer.listen(port, () => {
    console.log(chalk
        .bgHex(`#009e41`)
        .bold(`\nRest API is now running on http://localhost:${port}\n`));
});
