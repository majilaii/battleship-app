import { Express, Request, Response } from "express";
import { Board, Ship } from "../utils/game";
import {
  generateRandomBoard,
  generateBoard,
} from "../utils/generateRandomGrid";

let playerTurn = true;
let playerGame: Board;
let computerGame: Board;

computerGame = generateRandomBoard();
playerGame = generateBoard();

function startGame(req: Request, res: Response) {
  const { playerShipPlacement } = req.body;
  //checking the inputs

  if (!Array.isArray(playerShipPlacement))
    return res.status(400).json({ message: "Invalid input types" });

  for (let i = 0; i < playerShipPlacement.length; i++) {
    if (
      typeof playerShipPlacement[i].col !== "number" ||
      typeof playerShipPlacement[i].row !== "number" ||
      typeof playerShipPlacement[i].size !== "number" ||
      typeof playerShipPlacement[i].name !== "string" ||
      typeof playerShipPlacement[i].orientation !== "string"
    ) {
      return res.status(400).json({ message: "Invalid input types" });
    }
  }

  for (let i = 0; i < playerShipPlacement.length; i++) {
    const { name, size, col, row, orientation } = playerShipPlacement[i];
    const ship = new Ship(name, size, "player", "", []);
    const result = playerGame.placeShipsManual(row, col, ship, orientation);
    if (!result)
      return res.status(400).json({ message: "Ship Placement Invalid" });
  }

  return res.status(200).json({ message: "Ships' Placements Successful" });
}

function shoot(req: Request, res: Response) {
  const { row, col, owner } = req.body;
  let result: { valid: boolean; result?: string; ship?: Ship | null } | void;
  if (
    typeof row !== "number" ||
    typeof col !== "number" ||
    typeof owner !== "string"
  )
    return res.status(400).json({ message: "Invalid input types" });

  if (
    (owner === "player" && playerTurn) ||
    (owner === "computer" && !playerTurn)
  ) {
    // Send a bad request response if it is not the correct turn
    res.status(400).json({ message: "Invalid turn" });
    return;
  }

  if (owner === "player") {
    result = computerGame.shoot(row, col);
  } else {
    result = playerGame.randomShoot();
  }

  if (result && result.valid) {
    res.status(200).json(result);
    playerTurn = !playerTurn;
  }

  if (result && !result.valid) {
    res.status(400).json({ message: "invalid shot" });
  }
}

function reset(req: Request, res: Response) {
  playerGame = generateBoard();
  computerGame = generateRandomBoard();

  res.status(200).json({ message: "Game Reset Successfully!" });
}

export { startGame, shoot };
