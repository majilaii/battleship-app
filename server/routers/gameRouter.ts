import Express, { Router } from "express";
import {
  shoot,
  startGame,
  getBoard,
  getComputerBoard,
  startGameRandom,
  reset,
} from "../controllers/gameController";
const gameRouter = Express.Router();

gameRouter.post("/singleplayer/game", startGame); // User presses start game and begins the game against a bot
gameRouter.post("/singleplayer/gamerandom", startGameRandom); // User randomizes his ship placements against a bot and starts game
gameRouter.post("/singleplayer/shoot", shoot); // User/Bot shoots the opponent's board
gameRouter.get("/singleplayer/getboard", getBoard); //This is not needed for the frontend but can be useful for pure API usage
gameRouter.get("/singleplayer/getcomputerboard", getComputerBoard); //This is not needed due to it being cheating but can be useful for pure API usage
gameRouter.post("/singleplayer/reset", reset); // Reset Board

export { gameRouter };
