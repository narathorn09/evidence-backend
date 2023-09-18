"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const corsOptions_1 = require("../config/corsOptions");
const credentials_1 = require("./middleware/credentials");
const routerv1_1 = __importDefault(require("./router/routerv1"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const cookieParser = require("cookie-parser");
const chalk = require("chalk");
const cors = require("cors");
const { server: { port, host }, } = require("config");
const app = (0, express_1.default)();
app.use(credentials_1.credentials);
app.use(cors(corsOptions_1.corsOptions));
// app.use(express.urlencoded({extended: true }));
app.use(express_1.default.json({ limit: "100mb" }));
app.use(cookieParser());
app.use("/asset", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.post("/api/v1/uploads", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { evidence_list } = req.body;
        const uploadedImages = [];
        evidence_list.forEach((evidence, index) => {
            const uploadedEvidence = {
                evidence_factor: [],
                evidence_amount: evidence.evidence_amount,
                type_e_id: evidence.type_e_id,
                type_e_name: evidence.type_e_name, // Access the type_e_name property from evidence_list
            };
            evidence.evidence_factor.forEach((ef, i) => {
                const filename = `${(0, uuid_1.v1)()}.png`;
                const pathImg = `${__dirname}/../uploads/${filename}`;
                if (ef.ef_photo) {
                    const base64Data = ef.ef_photo.replace(/^data:([A-Za-z-+/]+);base64,/, "");
                    fs_1.default.writeFileSync(pathImg, base64Data, { encoding: "base64" });
                    uploadedEvidence.evidence_factor.push({
                        // url: `${host}/asset/${filename}`,
                        ef_photo: `${filename}`,
                        ef_detail: ef.ef_detail,
                        assignGroupId: ef.assignGroupId || null
                    });
                }
                else if (ef.ef_photo === null) {
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
    }
    catch (err) {
        next(err);
    }
}));
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
