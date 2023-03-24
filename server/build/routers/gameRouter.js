"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameRouter = void 0;
const express_1 = __importDefault(require("express"));
const gameController_1 = require("../controllers/gameController");
const gameRouter = express_1.default.Router();
exports.gameRouter = gameRouter;
gameRouter.post("/singlePlayer/game", gameController_1.startGame); // User presses start game and begins the game against a bot
gameRouter.post("/singlePlayer/shoot", gameController_1.shoot); // User/Bot shoots the opponent's board
gameRouter.post("/singlePlayer/getBoard", gameController_1.getBoard); //This is not needed for the frontend but can be useful for pure API usage
gameRouter.post("/singlePlayer/getComputerBoard", gameController_1.getComputerBoard); //This is not needed due to it being cheating but can be useful for pure API usage
gameRouter.post("/singlePlayer/reset", gameController_1.reset); // Reset Board
