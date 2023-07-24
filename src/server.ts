import express, { Application, Request, Response, NextFunction } from "express";
import { createServer, Server } from "http";
import { corsOptions } from "../config/corsOptions";
import { credentials } from "./middleware/credentials";
import routerv1 from "./router/routerv1";
import path from "path";
import fs from "fs";
import { v1 as uuid } from "uuid";
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const cors = require("cors");
const {
  server: { port, host },
} = require("config");

const app: Application = express();
app.use(credentials);
app.use(cors(corsOptions));
// app.use(express.urlencoded({extended: true }));
app.use(express.json({ limit: "100mb" }));
app.use(cookieParser());
app.use("/asset", express.static(path.join(__dirname, "../uploads")));

interface Evidence {
  ef_photo: string | null;
  ef_detail: string;
  assignGroupId: number
}

interface UploadedEvidence {
  evidence_factor: { ef_photo: string | null; ef_detail: string; assignGroupId: number | null}[];
  evidence_amount: number; // Assuming evidence_amount is a number, change the type accordingly if needed
  type_e_id: string; // Assuming type_e_id is a string, change the type accordingly if needed
  type_e_name: string; // Assuming type_e_name is a string, change the type accordingly if needed
}

interface EvidenceList {
  evidence_factor: Evidence[];
  evidence_amount: number;
  type_e_id: string;
  type_e_name: string;
}

app.post(
  "/api/v1/uploads",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { evidence_list } = req.body;
      const uploadedImages: {}[] = [];

      evidence_list.forEach((evidence: EvidenceList, index: number) => {
        const uploadedEvidence: UploadedEvidence = {
          evidence_factor: [], // Corrected declaration
          evidence_amount: evidence.evidence_amount, // Access the evidence_amount property from evidence_list
          type_e_id: evidence.type_e_id, // Access the type_e_id property from evidence_list
          type_e_name: evidence.type_e_name, // Access the type_e_name property from evidence_list
        };

        evidence.evidence_factor.forEach((ef: any, i: number) => {
          const filename = `${uuid()}.png`;
          const pathImg = `${__dirname}/../uploads/${filename}`;

          if (ef.ef_photo) {
            const base64Data = ef.ef_photo.replace(
              /^data:([A-Za-z-+/]+);base64,/,
              ""
            );
            fs.writeFileSync(pathImg, base64Data, { encoding: "base64" });

            uploadedEvidence.evidence_factor.push({
              // url: `${host}/asset/${filename}`,
              ef_photo: `${filename}`,
              ef_detail: ef.ef_detail,
              assignGroupId: ef.assignGroupId || null
            });
          } else if (ef.ef_photo === null) {
            uploadedEvidence.evidence_factor.push({
              ef_photo: null,
              ef_detail: ef.ef_detail,
              assignGroupId: ef.assignGroupId || null
            });
          }
        });
        uploadedImages.push(uploadedEvidence);
      });

      res.status(200).json({
        result: uploadedImages || [],
      });
    } catch (err) {
      next(err);
    }
  }
);

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
