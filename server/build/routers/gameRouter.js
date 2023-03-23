"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRouter = void 0;
const express_1 = __importDefault(require("express"));
const game_1 = require("../controllers/game");
const gameRouter = express_1.default.Router();
exports.gameRouter = gameRouter;
gameRouter.post("/singlePlayer/game", game_1.startGame);
gameRouter.post("/singlePlayer/shoot", game_1.shoot);
