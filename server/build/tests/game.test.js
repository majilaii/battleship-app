"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Ship.test.js
const game_1 = require("../utils/game");
const game_2 = require("../utils/game");
describe("Ship", () => {
    let ship;
    beforeEach(() => {
        // create a new ship object before each test
        ship = new game_2.Ship("Battleship", 4, "player", "horizontal", [
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
        ]);
    });
    // test the constructor
    it("should create a ship object with given properties", () => {
        expect(ship.name).toBe("Battleship");
        expect(ship.size).toBe(4);
        expect(ship.owner).toBe("player");
        expect(ship.orientation).toBe("horizontal");
        expect(ship.coordinates).toEqual([
            { row: 1, col: 1 },
            { row: 1, col: 2 },
            { row: 1, col: 3 },
            { row: 1, col: 4 },
        ]);
        expect(ship.hits).toBe(0);
        // if orientation is not given, it should be randomly assigned
        const randomShip = new game_2.Ship("Destroyer", 3, "computer", "", [
            { row: 2, col: 2 },
            { row: 3, col: 2 },
            { row: 4, col: 2 },
        ]);
        expect(randomShip.orientation).toMatch(/horizontal|vertical/);
    });
    // test the randomOrientation method
    it("should return either horizontal or vertical", () => {
        const spy = jest.spyOn(game_2.Ship.prototype, "randomOrientation");
        const orientation = ship.randomOrientation();
        expect(spy).toHaveBeenCalled();
        expect(orientation).toMatch(/horizontal|vertical/);
        spy.mockRestore();
    });
    // test the isSunk method
    it("should return true if hits equal size", () => {
        ship.hits = ship.size;
        expect(ship.isSunk()).toBe(true);
    });
    it("should return false if hits less than size", () => {
        ship.hits = ship.size - 1;
        expect(ship.isSunk()).toBe(false);
    });
    // test the hit method
    it("should increment hits by one", () => {
        const prevHits = ship.hits;
        ship.hit();
        expect(ship.hits).toBe(prevHits + 1);
    });
});
describe("Board", () => {
    let board;
    beforeEach(() => {
        board = new game_1.Board();
    });
    test("should create a board with 10x10 cells", () => {
        expect(board).toBeInstanceOf(game_1.Board);
        expect(board.board.length).toBe(10);
        expect(board.board[0].length).toBe(10);
        expect(board.board[0][0]).toEqual({
            occupied: false,
            ship: null,
            shot: false,
        });
    });
    test("should check if all ships are sunk", () => {
        // Place two ships on the board
        const spyAllSunk = jest.spyOn(board, "allShipsSunk");
        const ship1 = new game_2.Ship("Carrier", 5, "player", "horizontal", []);
        const ship2 = new game_2.Ship("Patrol Boat", 2, "player", "vertical", []);
        board.placeShipsManual(0, 0, ship1, "horizontal");
        board.placeShipsManual(8, 8, ship2, "vertical");
        // Check if all ships are sunk before any shots
        let result = board.allShipsSunk();
        expect(spyAllSunk).toBeCalled();
        expect(result).toBe(false);
        // Shoot at one ship until it sinks
        for (let i = 0; i < ship1.size; i++) {
            board.shoot(0, i);
        }
        // Check if all ships are sunk after sinking one ship
        result = board.allShipsSunk();
        expect(spyAllSunk).toBeCalled();
        expect(result).toBe(false);
        // Shoot at the other ship until it sinks
        for (let i = 0; i < ship2.size; i++) {
            board.shoot(9 - i, 8);
        }
        // Check if all ships are sunk after sinking both ships
        result = board.allShipsSunk();
        expect(spyAllSunk).toBeCalled();
        expect(result).toBe(true);
    });
    test("should place ships manually on the board", () => {
        const ship = new game_2.Ship("Battleship", 4, "player", "horizontal", []);
        const spyPlace = jest.spyOn(board, "placeShipsManual");
        const result = board.placeShipsManual(0, 0, ship, "horizontal");
        expect(spyPlace).toHaveBeenCalledWith(0, 0, ship, "horizontal");
        expect(result).toBe(true);
        expect(board.board[0][0].occupied).toBe(true);
        expect(board.board[0][1].occupied).toBe(true);
        expect(board.board[0][2].occupied).toBe(true);
        expect(board.board[0][3].occupied).toBe(true);
        spyPlace.mockRestore();
    });
    test("should place ships randomly on the board", () => {
        const ship = new game_2.Ship("Destroyer", 2, "computer", "", []);
        const spyRandom = jest.spyOn(board, "placeShipsRandom");
        board.placeShipsRandom(ship);
        // Check if the spy was called with the ship argument
        expect(spyRandom).toHaveBeenCalledWith(ship);
        // Check if the ship was added to the ships array
        expect(board.ships.length).toBe(1);
        // Check if any cell on the board has a reference to the ship
        let found = false;
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 10; j++) {
                if (board.board[i][j].ship === ship) {
                    found = true;
                    break;
                }
            }
        }
        expect(found).toBe(true);
        spyRandom.mockRestore();
    });
    test("should shoot at a given cell and return a result", () => {
        const ship = new game_2.Ship("Submarine", 3, "player", "horizontal", [
            { row: 5, col: 5 },
            { row: 5, col: 6 },
            { row: 5, col: 7 },
        ]);
        // Place a ship manually at (5,5), (5,6), (5,7)
        board.placeShipsManual(5, 5, ship, "horizontal");
        // Shoot at an empty cell
        let result = board.shoot(9, 9);
        // Expect a valid and miss result
        expect(result.valid).toBe(true);
        expect(result.result).toBe("miss");
        // Shoot at an occupied cell
        result = board.shoot(5, 6);
        // Expect a valid and hit result
        expect(result.valid).toBe(true);
        expect(result.result).toBe("hit");
        // Shoot at an invalid cell
        result = board.shoot(-1, -1);
        // Expect an invalid result
        expect(result.valid).toBe(false);
    });
    test("should check if a given cell is within bounds", () => {
        const spyCheck = jest.spyOn(board, "checkWithinBounds");
        // Check a valid cell
        let result = board.checkWithinBounds(3, 3);
        expect(spyCheck).toHaveBeenCalledWith(3, 3);
        expect(result).toBe(true);
        // Check an invalid cell
        result = board.checkWithinBounds(-1, -1);
        expect(spyCheck).toHaveBeenCalledWith(-1, -1);
        expect(result).toBe(false);
        spyCheck.mockRestore();
    });
});
