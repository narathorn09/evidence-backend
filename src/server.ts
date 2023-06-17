import express, { Application, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { corsOptions } from "../config/corsOptions";
import { mysqlDB } from "./db/mysql";
import routerv1 from "./router/v1/router";
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const cors = require("cors");
const {
  server: { port },
} = require("config");

const app: Application = express();
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
mysqlDB.connect();
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello, API For Express & MySQL");
});
app.use("/api/v1/", routerv1);

const httpServer: Server = createServer(app);

httpServer.listen(port as number, () => {
  console.log(
    chalk
      .bgHex(`#009e41`)
      .bold(`\nRest API is now running on http://localhost:${port}\n`)
  );
});
