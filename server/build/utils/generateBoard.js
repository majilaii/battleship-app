"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBoard = exports.generateRandomBoard = void 0;
const gameClass_1 = require("./gameClass");
function generateRandomBoard() {
    const board = new gameClass_1.Board();
    // Create some ships with different names and sizes
    const carrier = new gameClass_1.Ship("carrier", 5, "computer", "", []);
    const battleship = new gameClass_1.Ship("battleship", 4, "computer", "", []);
    const cruiser = new gameClass_1.Ship("cruiser", 3, "computer", "", []);
    const submarine = new gameClass_1.Ship("submarine", 3, "computer", "", []);
    const destroyer = new gameClass_1.Ship("destroyer", 2, "computer", "", []);
    // Place the ships on the board randomly
    board.placeShipsRandom(carrier);
    board.placeShipsRandom(battleship);
    board.placeShipsRandom(cruiser);
    board.placeShipsRandom(submarine);
    board.placeShipsRandom(destroyer);
    // Return the board
    return board;
}
exports.generateRandomBoard = generateRandomBoard;
function generateBoard() {
    const board = new gameClass_1.Board();
    return board;
}
exports.generateBoard = generateBoard;
