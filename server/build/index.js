"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = __importStar(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
dotenv.config();
const express_1 = __importDefault(require("express"));
const gameRouter_1 = require("./routers/gameRouter");
const app = (0, express_1.default)(); //Initiate Express App
app.use(express_1.default.json()); // Express bodyparser
const port = process.env.PORT || 5000; // Get PORT from .env, but since it is not going into production, this is not needed
const corsOptions = {
    origin: "*",
    methods: "GET,PUT,POST,PATCH,DELETE",
    allowedHeaders: "Content-Type",
    optionsSuccessStatus: 200, // Send this status for preflight requests
};
app.use((0, cors_1.default)(corsOptions)); // Apply cors
app.get("/", (req, res) => {
    res.send("Hello World");
});
app.use(gameRouter_1.gameRouter);
app.listen(port, () => {
    console.log(`server is running at http://localhost:${port}`);
});
