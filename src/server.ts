import config from "config";
import express, { Application, Request, Response, NextFunction } from "express";
const mysql = require("mysql2");
const cors = require("cors");
const port = config.get("app.port");
const app: Application = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "Forensic_Science",
});
db.connect();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello, Narathorn Nooasdphum");
});

app.post(
  "/create-member",
  (req: Request, res: Response, next: NextFunction) => {
    const { id, role, username, password } = req.query;
    const query =
      "INSERT INTO Member (mem_id, mem_type, mem_username, mem_password) VALUES (?, ?, ?, ?)";
    const data = [id, role, username, password];
    db.query(query, data, (err: any, result: any) => {
      if (err) {
        console.log(err);
      } else {
        res.send(result);
      }
    });
  }
);

app.get("/member", (req: Request, res: Response, next: NextFunction) => {
  const query = "Select * from member";
  db.query(query, (err: any, result: any) => {
    if (err) {
      console.log(err);
    } else {
      res.send(result);
    }
  });
});

app.listen(port as number, () => {
  console.log(`Rest API is now running on http://localhost:${port}`);
});
