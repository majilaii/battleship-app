"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBoard = exports.generateRandomBoard = void 0;
const game_1 = require("./game");
function generateRandomBoard() {
    const board = new game_1.Board();
    // Create some ships with different names and sizes
    const carrier = new game_1.Ship("carrier", 5, "computer", "", []);
    const battleship = new game_1.Ship("battleship", 4, "computer", "", []);
    const cruiser = new game_1.Ship("cruiser", 3, "computer", "", []);
    const submarine = new game_1.Ship("submarine", 3, "computer", "", []);
    const destroyer = new game_1.Ship("destroyer", 2, "computer", "", []);
    // Place the ships on the board randomly
    // board.placeShipsRandom(carrier);
    // board.placeShipsRandom(battleship);
    // board.placeShipsRandom(cruiser);
    // board.placeShipsRandom(submarine);
    board.placeShipsRandom(destroyer);
    // Return the board
    return board;
}
exports.generateRandomBoard = generateRandomBoard;
function generateBoard() {
    const board = new game_1.Board();
    return board;
}
exports.generateBoard = generateBoard;
