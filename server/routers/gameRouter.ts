import Express, { Router } from "express";
import { shoot, startGame } from "../controllers/game";
const gameRouter = Express.Router();

gameRouter.post("/singlePlayer/game", startGame);
gameRouter.post("/singlePlayer/shoot", shoot);

export { gameRouter };
