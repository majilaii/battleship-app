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
gameRouter.post("/singleplayer/game", gameController_1.startGame); // User presses start game and begins the game against a bot
gameRouter.post("/singleplayer/gamerandom", gameController_1.startGameRandom); // User randomizes his ship placements against a bot and starts game
gameRouter.post("/singleplayer/shoot", gameController_1.shoot); // User/Bot shoots the opponent's board
gameRouter.get("/singleplayer/getboard", gameController_1.getBoard); //This is not needed for the frontend but can be useful for pure API usage
gameRouter.get("/singleplayer/getcomputerboard", gameController_1.getComputerBoard); //This is not needed due to it being cheating but can be useful for pure API usage
gameRouter.post("/singleplayer/reset", gameController_1.reset); // Reset Board
