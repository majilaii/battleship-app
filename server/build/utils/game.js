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
        this.unshotCells = new Set();
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                this.unshotCells.add(`${i}-${j}`);
            }
        }
        for (let i = 0; i < 10; i++) {
            this.board[i] = [];
            for (let j = 0; j < 10; j++) {
                this.board[i][j] = { occupied: false, ship: null, shot: false };
            }
        }
    }
    placeShipsManual(row, col, ship, orientation) {
        // Checking if the placement of the ship is valid
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
        // If orientation is horizontal, we add all the coordinates to the ship instance and modify the ship and occupied property on each cell it is on
        for (let i = 0; i < ship.size; i++) {
            if (orientation === "horizontal") {
                this.board[row][col + i].occupied = true;
                this.board[row][col + i].ship = ship;
                ship.coordinates.push({ row, col: col + i });
            }
            else {
                // If orientation is vertical, we add all the coordinates to the ship instance and modify the ship and occupied property on each cell it is on
                this.board[row + i][col].occupied = true;
                this.board[row + i][col].ship = ship;
                ship.coordinates.push({ row: row + 1, col });
            }
        }
        // Add to board's ship array
        this.ships.push(ship);
        return true;
    }
    placeShipsRandom(ship) {
        let row = 0;
        let col = 0;
        let valid;
        // Loop until a valid position is found
        while (true) {
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
            if (valid)
                break; // If a valid position is found, exit the loop
        }
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
        // Add to board's ship array
        this.ships.push(ship);
    }
    shoot(row, col) {
        // Check if the row and col coordinates are in bound
        if (!this.checkWithinBounds(row, col))
            return { valid: false };
        // Check if the cell has already been shot
        if (this.board[row][col].shot)
            return { valid: false };
        // If not, mark the cell as shot
        this.board[row][col].shot = true;
        // Delete the key-value from the unshotCells set
        this.unshotCells.delete(`${row}-${col}`);
        // Check if the cell contains a ship
        const ship = this.board[row][col].ship;
        // If there is no ship, return miss
        if (!ship) {
            return { valid: true, result: "miss", ship: null };
        }
        // If there is a ship, increase hit count
        ship.hit();
        // If the ship is sunk, check if all ships are sunk
        if (ship.isSunk()) {
            const result = this.allShipsSunk() ? "You Win" : "sunk";
            return { valid: true, result, ship };
        }
        // If the ship is not sunk, return hit
        return { valid: true, result: "hit", ship: null };
    }
    randomShoot() {
        if (this.unshotCells.size === 0) {
            return { valid: false, result: "No more cells to shoot", ship: null };
        }
        // Pick a random unshot cell in the set
        const randomIndex = Math.floor(Math.random() * this.unshotCells.size);
        // Convert this set into an array and get one of its random element
        const randomCellKey = Array.from(this.unshotCells)[randomIndex];
        // Delete the random unshot cell from the set
        this.unshotCells.delete(randomCellKey);
        // Extract row and col from the cell key by splitting and parsing the string
        const [row, col] = randomCellKey
            .split("-")
            .map((coord) => parseInt(coord, 10));
        this.board[row][col].shot = true;
        const ship = this.board[row][col].ship;
        // If there is no ship, return miss
        if (!ship) {
            return { valid: true, result: "miss", ship: null };
        }
        // If there is a ship, increase hit count
        ship.hit();
        // If the ship is sunk, check if all ships are sunk
        if (ship.isSunk()) {
            const result = this.allShipsSunk() ? "You Win" : "sunk";
            return { valid: true, result, ship };
        }
        // If the ship is not sunk, return hit
        return { valid: true, result: "hit", ship };
    }
    shootIntelligently() {
        // Find hit cells and their neighbors
        const hitCells = [];
        const hitCellsNeighbors = [];
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (this.board[i][j].shot && this.board[i][j].ship) {
                    hitCells.push({ row: i, col: j });
                    const neighbors = [
                        { row: i - 1, col: j },
                        { row: i + 1, col: j },
                        { row: i, col: j - 1 },
                        { row: i, col: j + 1 },
                    ];
                    for (const neighbor of neighbors) {
                        if (this.checkWithinBounds(neighbor.row, neighbor.col) &&
                            !this.board[neighbor.row][neighbor.col].shot &&
                            this.board[neighbor.row][neighbor.col].ship) {
                            hitCellsNeighbors.push(neighbor);
                        }
                    }
                }
            }
        }
        // If there are unshot neighbors, shoot at one of them
        if (hitCellsNeighbors.length !== 0) {
            const randomElement = hitCellsNeighbors[Math.floor(Math.random() * hitCellsNeighbors.length)];
            return this.shoot(randomElement.row, randomElement.col);
        }
        // If there are no hit cells, shoot randomly
        if (hitCells.length === 0) {
            return this.randomShoot();
        }
        // If there are hit cells but no unshot neighbors, shoot randomly
        return this.randomShoot();
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
