"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("config"));
const express_1 = __importDefault(require("express"));
const mysql = require("mysql2");
const cors = require("cors");
const port = config_1.default.get("app.port");
const app = (0, express_1.default)();
app.use(cors());
app.use(express_1.default.json());
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "Forensic_Science",
});
db.connect();
app.get("/", (req, res, next) => {
    res.send("Hello, Narathorn Nooasdphum");
});
app.post("/create-member", (req, res, next) => {
    const { id, role, username, password } = req.query;
    const query = "INSERT INTO Member (mem_id, mem_type, mem_username, mem_password) VALUES (?, ?, ?, ?)";
    const data = [id, role, username, password];
    db.query(query, data, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});
app.get("/member", (req, res, next) => {
    const query = "Select * from member";
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.send(result);
        }
    });
});
app.listen(port, () => {
    console.log(`Rest API is now running on http://localhost:${port}`);
});
