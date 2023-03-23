// Define constants
const BOARD_SIZE = 10;

export class Ship {
  name: string;
  size: number;
  owner: "player" | "computer";
  orientation: string;
  coordinates: { row: number; col: number }[];
  hits: number;
  constructor(
    name: string,
    size: number,
    owner: "player" | "computer",
    orientation: string,
    coordinates: { row: number; col: number }[]
  ) {
    this.name = name;
    this.size = size;
    this.orientation = orientation;
    this.coordinates = coordinates;
    this.owner = owner;
    this.hits = 0;
  }

  randomOrientation(): string {
    return Math.random() > 0.5 ? "horizontal" : "vertical";
  }

  isSunk(): boolean {
    return this.hits === this.size;
  }

  hit(): void {
    this.hits++;
  }
}

export class Board {
  board: {
    occupied: boolean;
    ship?: Ship | null;
    shot: boolean;
  }[][];

  ships: Ship[];

  constructor() {
    this.board = [];
    this.ships = [];

    for (let i = 0; i < BOARD_SIZE; i++) {
      this.board[i] = [];
      for (let j = 0; j < BOARD_SIZE; j++) {
        this.board[i][j] = { occupied: false, ship: null, shot: false };
      }
    }
  }

  placeShipsManual(
    row: number,
    col: number,
    ship: Ship,
    orientation: "horizontal" | "vertical"
  ): boolean {
    //checking if the placement of the ship is valid can be dealt with in the frontend, but I will still code the checks here
    for (let i = 0; i < ship.size; i++) {
      if (orientation === "horizontal") {
        if (row + i >= BOARD_SIZE || this.board[row][col].occupied) {
          return false;
        }
      } else {
        if (col + i >= BOARD_SIZE || this.board[row][col].occupied) {
          return false;
        }
      }
    }

    for (let i = 0; i < ship.size; i++) {
      if (orientation === "horizontal") {
        this.board[row][col].occupied = true;
        this.board[row][col].ship = ship;
        ship.coordinates.push({ row, col: col + i });
      } else {
        this.board[row][col].occupied = true;
        this.board[row][col].ship = ship;
        ship.coordinates.push({ row: row + 1, col });
      }
    }

    this.ships.push(ship);

    return true;
  }

  placeShipsRandom(ship: Ship): void {
    const orientation = Math.random() > 0.5 ? "horizontal" : "vertical";
    let row: number;
    let col: number;
    let valid: boolean = false;

    while (!valid) {
      row = Math.floor(Math.random() * BOARD_SIZE);
      col = Math.floor(Math.random() * BOARD_SIZE);

      valid = true;

      for (let i = 0; i < ship.size; i++) {
        if (orientation === "horizontal") {
          if (row + i >= BOARD_SIZE || this.board[row][col].occupied) {
            valid = false;
            break;
          }
        } else {
          if (col + i >= BOARD_SIZE || this.board[row][col].occupied) {
            valid = false;
            break;
          }
        }

        for (let i = 0; i < ship.size; i++) {
          if (orientation === "horizontal") {
            this.board[row][col].occupied = true;
            this.board[row][col].ship = ship;
            ship.coordinates.push({ row, col: col + i });
          } else {
            this.board[row][col].occupied = true;
            this.board[row][col].ship = ship;
            ship.coordinates.push({ row: row + 1, col });
          }
        }
      }
    }

    this.ships.push(ship);
  }

  shoot(
    row: number,
    col: number
  ): { valid: boolean; result?: string; ship?: Ship | null } | void {
    if (!this.checkWithinBounds) return { valid: false };

    if (this.board[row][col].shot) return { valid: false };

    this.board[row][col].shot = true;

    const ship = this.board[row][col].ship;

    if (ship) {
      ship.hit();

      if (ship.isSunk()) {
        if (this.allShipsSunk()) {
          return {
            valid: true,
            result: ship.owner === "computer" ? "You Win" : "You Lose",
            ship,
          };
        }
        return { valid: true, result: "sunk", ship };
      }

      if (!ship.isSunk) {
        return { valid: true, result: "hit", ship };
      }
    } else {
      return { valid: true, result: "miss", ship: null };
    }
  }

  randomShoot(): {
    valid: boolean;
    result?: string;
    ship?: Ship | null;
  } | void {
    const row: number = Math.floor(Math.random() * BOARD_SIZE);
    const col: number = Math.floor(Math.random() * BOARD_SIZE);

    if (this.board[row][col].shot) return { valid: false };

    this.board[row][col].shot = true;

    const ship = this.board[row][col].ship;

    if (ship) {
      ship.hit();

      if (ship.isSunk()) {
        return { valid: true, result: "sunk", ship };
      }

      if (!ship.isSunk) {
        return { valid: true, result: "hit", ship };
      }
    } else {
      return { valid: true, result: "miss", ship: null };
    }
  }

  checkWithinBounds(size: number, row: number, col: number): boolean {
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return false;
    }
    return true;
  }

  allShipsSunk(): boolean {
    let AllSunk = true;

    for (let i = 0; i < this.ships.length; i++) {
      if (!this.ships[i].isSunk()) AllSunk = false;
    }

    return AllSunk;
  }
}
