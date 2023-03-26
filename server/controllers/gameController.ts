import { Express, Request, Response } from "express";
import { Board, Ship } from "../utils/gameClass";
import { generateRandomBoard, generateBoard } from "../utils/generateBoard";

let playerTurn = true;
let playerGame: Board;
let computerGame: Board;
let gameOver = false;

function startGame(req: Request, res: Response) {
  if (!req.body || Object.keys(req.body).length === 0) {
    // Send an error response with status code 400 (Bad Request)
    res.status(400).json({ message: "req.body is empty" });
    return;
  }

  computerGame = generateRandomBoard();
  playerGame = generateBoard();

  const { playerShipPlacement } = req.body;

  //checking the inputs
  if (!Array.isArray(playerShipPlacement)) {
    res.status(400).json({ message: "Invalid input types" });
    return;
  }

  for (let i = 0; i < playerShipPlacement.length; i++) {
    if (
      typeof playerShipPlacement[i].col !== "number" ||
      typeof playerShipPlacement[i].row !== "number" ||
      typeof playerShipPlacement[i].size !== "number" ||
      typeof playerShipPlacement[i].name !== "string" ||
      typeof playerShipPlacement[i].orientation !== "string"
    ) {
      res.status(400).json({ message: "Invalid input types" });
      return;
    }
  }

  gameOver = false;

  for (let i = 0; i < playerShipPlacement.length; i++) {
    const { name, size, col, row, orientation } = playerShipPlacement[i];
    const ship = new Ship(name, size, "player", "", []);
    const result = playerGame.placeShipsManual(row, col, ship, orientation);
    if (!result) {
      res.status(400).json({ message: "Ship Placement Invalid" });
      return;
    }
  }

  res.status(200).json({ message: "Ships Placements Successful" });
}

function startGameRandom(req: Request, res: Response) {
  computerGame = generateRandomBoard();
  playerGame = generateRandomBoard();

  res.status(200).json({ message: "Ships Placements Successful" });
}

function shoot(req: Request, res: Response) {
  if (gameOver) {
    res.status(400).json({ message: "Game Is Over: Press Reset" });
    return;
  }

  if (!req.body || Object.keys(req.body).length === 0) {
    // Send an error response with status code 400 (Bad Request)
    res.status(400).send("Bad Request: req.body is empty");
    return;
  }
  const { row, col, owner } = req.body;

  let result: { valid: boolean; result?: string; ship?: Ship | null } | void;

  if (
    typeof row !== "number" ||
    typeof col !== "number" ||
    typeof owner !== "string"
  ) {
    res.status(400).json({ message: "Invalid input types" });
    return;
  }

  if (
    (owner === "player" && !playerTurn) ||
    (owner === "computer" && playerTurn)
  ) {
    // Send a bad request response if it is not the correct turn
    res.status(400).json({ message: "Invalid turn" });
    return;
  }

  if (owner === "player") {
    result = computerGame.shoot(row, col);
  } else {
    result = playerGame.shootIntelligently();
  }

  if (result.valid) {
    playerTurn = !playerTurn;
    if (result.result === "You Win" || result.result === "You Lose") {
      res.status(200).json(result);
      gameOver = true;
    }
    res.status(200).json(result);
    return;
  }

  if (!result.valid) {
    res.status(400).json({ message: "invalid shot" });
    return;
  }
}

function reset(req: Request, res: Response) {
  playerGame = generateBoard();

  gameOver = false;
  res.status(200).json({ message: "Game Reset Successfully!" });
}

function getBoard(req: Request, res: Response) {
  res.status(200).json({ message: playerGame });
}

//for testing purposes, this function won't be here in the actual API as it would allow users to cheat
function getComputerBoard(req: Request, res: Response) {
  res.status(200).json({ message: computerGame });
}

export { startGame, shoot, getBoard, getComputerBoard, reset, startGameRandom };
