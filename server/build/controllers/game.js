"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.reset = exports.getComputerBoard = exports.getBoard = exports.shoot = exports.startGame = void 0;
const game_1 = require("../utils/game");
const generateBoard_1 = require("../utils/generateBoard");
let playerTurn = true;
let playerGame;
let computerGame;
let gameOver = false;
function startGame(req, res) {
    if (!req.body || Object.keys(req.body).length === 0) {
        // Send an error response with status code 400 (Bad Request)
        res.status(400).json({ message: "req.body is empty" });
        return;
    }
    computerGame = (0, generateBoard_1.generateRandomBoard)();
    playerGame = (0, generateBoard_1.generateBoard)();
    console.log(playerGame.allShipsSunk());
    const { playerShipPlacement } = req.body;
    //checking the inputs
    if (!Array.isArray(playerShipPlacement)) {
        res.status(400).json({ message: "Invalid input types" });
        return;
    }
    for (let i = 0; i < playerShipPlacement.length; i++) {
        if (typeof playerShipPlacement[i].col !== "number" ||
            typeof playerShipPlacement[i].row !== "number" ||
            typeof playerShipPlacement[i].size !== "number" ||
            typeof playerShipPlacement[i].name !== "string" ||
            typeof playerShipPlacement[i].orientation !== "string") {
            res.status(400).json({ message: "Invalid input types" });
            return;
        }
    }
    for (let i = 0; i < playerShipPlacement.length; i++) {
        const { name, size, col, row, orientation } = playerShipPlacement[i];
        const ship = new game_1.Ship(name, size, "player", "", []);
        const result = playerGame.placeShipsManual(row, col, ship, orientation);
        if (!result) {
            res.status(400).json({ message: "Ship Placement Invalid" });
            return;
        }
    }
    res.status(200).json({ message: "Ships Placements Successful" });
}
exports.startGame = startGame;
function shoot(req, res) {
    if (gameOver) {
        res.status(400).send("Game Is Over: Press Reset");
        return;
    }
    if (!req.body || Object.keys(req.body).length === 0) {
        // Send an error response with status code 400 (Bad Request)
        res.status(400).send("Bad Request: req.body is empty");
        return;
    }
    const { row, col, owner } = req.body;
    let result;
    if (typeof row !== "number" ||
        typeof col !== "number" ||
        typeof owner !== "string") {
        res.status(400).json({ message: "Invalid input types" });
        return;
    }
    if ((owner === "player" && playerTurn) ||
        (owner === "computer" && !playerTurn)) {
        // Send a bad request response if it is not the correct turn
        res.status(400).json({ message: "Invalid turn" });
        return;
    }
    if (owner === "player") {
        result = computerGame.shoot(row, col);
    }
    else {
        result = playerGame.randomShoot();
    }
    if (result.valid) {
        playerTurn = !playerTurn;
        if (result.result === "You Win" || result.result === "You Lose") {
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
exports.shoot = shoot;
function reset(req, res) {
    playerGame = (0, generateBoard_1.generateBoard)();
    gameOver = false;
    res.status(200).json({ message: "Game Reset Successfully!" });
}
exports.reset = reset;
function getBoard(req, res) {
    res.status(200).json({ message: playerGame });
}
exports.getBoard = getBoard;
//for testing purposes, this function won't be here in the actual API as it would allow users to cheat
function getComputerBoard(req, res) {
    res.status(200).json({ message: computerGame });
}
exports.getComputerBoard = getComputerBoard;
