"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Board = exports.Ship = void 0;
// define Ship class
class Ship {
    constructor(name, size, owner, orientation, coordinates) {
        this.name = name;
        this.size = size;
        this.orientation = orientation;
        this.coordinates = coordinates;
        this.owner = owner;
        this.hits = 0;
        if (this.orientation === "")
            this.orientation = this.randomOrientation();
    }
    randomOrientation() {
        return Math.random() > 0.5 ? "horizontal" : "vertical";
    }
    isSunk() {
        return this.hits === this.size;
    }
    hit() {
        this.hits++;
    }
}
exports.Ship = Ship;
class Board {
    constructor() {
        this.board = [];
        this.ships = [];
        for (let i = 0; i < 10; i++) {
            this.board[i] = [];
            for (let j = 0; j < 10; j++) {
                this.board[i][j] = { occupied: false, ship: null, shot: false };
            }
        }
    }
    placeShipsManual(row, col, ship, orientation) {
        //checking if the placement of the ship is valid can be dealt with in the frontend, but I will still code the checks here
        for (let i = 0; i < ship.size; i++) {
            if (orientation === "horizontal") {
                if (row + i >= 10 || this.board[row][col].occupied) {
                    return false;
                }
            }
            else {
                if (col + i >= 10 || this.board[row][col].occupied) {
                    return false;
                }
            }
        }
        for (let i = 0; i < ship.size; i++) {
            if (orientation === "horizontal") {
                this.board[row][col + i].occupied = true;
                this.board[row][col + i].ship = ship;
                ship.coordinates.push({ row, col: col + i });
            }
            else {
                this.board[row + i][col].occupied = true;
                this.board[row + i][col].ship = ship;
                ship.coordinates.push({ row: row + 1, col });
            }
        }
        this.ships.push(ship);
        return true;
    }
    placeShipsRandom(ship) {
        // Generate a random orientation and position for the ship
        let row = 0;
        let col = 0;
        let valid = false;
        // Loop until a valid position is found
        do {
            // Pick a random starting cell
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
            // Check if the ship fits in the grid without overlapping
            valid = true;
            for (let i = 0; i < ship.size; i++) {
                if (ship.orientation === "horizontal") {
                    // Check if the cell is within bounds and not occupied
                    if (col + i >= 10 || this.board[row][col + i].occupied) {
                        valid = false;
                        break;
                    }
                }
                else {
                    // Check if the cell is within bounds and not occupied
                    if (row + i >= 10 || this.board[row + i][col].occupied) {
                        valid = false;
                        break;
                    }
                }
            }
        } while (!valid); // Loop until a valid position is found
        // Place the ship on the grid and update the board array
        for (let i = 0; i < ship.size; i++) {
            if (ship.orientation === "horizontal") {
                this.board[row][col + i].occupied = true;
                this.board[row][col + i].ship = ship;
                ship.coordinates.push({ row, col: col + i });
            }
            else {
                this.board[row + i][col].occupied = true;
                this.board[row + i][col].ship = ship;
                ship.coordinates.push({ row: row + i, col });
            }
        }
        // Add the ship to the ships array
        this.ships.push(ship);
    }
    shoot(row, col) {
        if (!this.checkWithinBounds(row, col))
            return { valid: false };
        if (this.board[row][col].shot)
            return { valid: false };
        this.board[row][col].shot = true;
        const ship = this.board[row][col].ship;
        if (ship) {
            ship.hit();
            if (ship.isSunk()) {
                if (this.allShipsSunk()) {
                    return {
                        valid: true,
                        result: "You Win",
                        ship,
                    };
                }
                return { valid: true, result: "sunk", ship };
            }
            return { valid: true, result: "hit", ship: null };
        }
        else {
            return { valid: true, result: "miss", ship: null };
        }
    }
    randomShoot() {
        const row = Math.floor(Math.random() * 10);
        const col = Math.floor(Math.random() * 10);
        if (this.board[row][col].shot)
            return { valid: false };
        this.board[row][col].shot = true;
        const ship = this.board[row][col].ship;
        if (ship) {
            ship.hit();
            if (ship.isSunk()) {
                if (this.allShipsSunk()) {
                    return {
                        valid: true,
                        result: "You Lose",
                        ship,
                    };
                }
                return { valid: true, result: "sunk", ship };
            }
            return { valid: true, result: "hit", ship };
        }
        else {
            return { valid: true, result: "miss", ship: null };
        }
    }
    checkWithinBounds(row, col) {
        if (row < 0 || row >= 10 || col < 0 || col >= 10) {
            return false;
        }
        return true;
    }
    allShipsSunk() {
        return this.ships.every((ship) => ship.isSunk());
    }
}
exports.Board = Board;
