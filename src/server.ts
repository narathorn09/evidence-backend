import config from "config";
import express, { Application, Request, Response, NextFunction } from "express";

const port = config.get("app.port");
const app: Application = express();

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send("Hello, Narathorn Nooasdphum");
});

app.listen(port, () => {
  console.log(`Rest API is now running on http://localhost:${port}`);
});
