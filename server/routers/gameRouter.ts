import Express, { Router } from "express";
import {
  shoot,
  startGame,
  getBoard,
  getComputerBoard,
  reset,
} from "../controllers/gameController";
const gameRouter = Express.Router();

gameRouter.post("/singlePlayer/game", startGame); // User presses start game and begins the game against a bot
gameRouter.post("/singlePlayer/shoot", shoot); // User/Bot shoots the opponent's board
gameRouter.post("/singlePlayer/getBoard", getBoard); //This is not needed for the frontend but can be useful for pure API usage
gameRouter.post("/singlePlayer/getComputerBoard", getComputerBoard); //This is not needed due to it being cheating but can be useful for pure API usage
gameRouter.post("/singlePlayer/reset", reset); // Reset Board

export { gameRouter };
