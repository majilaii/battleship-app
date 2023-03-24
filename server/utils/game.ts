// define Ship class
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
    if (this.orientation === "") this.orientation = this.randomOrientation();
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

    for (let i = 0; i < 10; i++) {
      this.board[i] = [];
      for (let j = 0; j < 10; j++) {
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
        if (row + i >= 10 || this.board[row][col].occupied) {
          return false;
        }
      } else {
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
      } else {
        this.board[row + i][col].occupied = true;
        this.board[row + i][col].ship = ship;
        ship.coordinates.push({ row: row + 1, col });
      }
    }

    this.ships.push(ship);

    return true;
  }

  placeShipsRandom(ship: Ship): void {
    // Generate a random orientation and position for the ship
    let row: number = 0;
    let col: number = 0;
    let valid: boolean = false;

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
        } else {
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
      } else {
        this.board[row + i][col].occupied = true;
        this.board[row + i][col].ship = ship;
        ship.coordinates.push({ row: row + i, col });
      }
    }

    // Add the ship to the ships array
    this.ships.push(ship);
  }

  shoot(
    row: number,
    col: number
  ): { valid: boolean; result?: string; ship?: Ship | null } {
    if (!this.checkWithinBounds(row, col)) return { valid: false };

    if (this.board[row][col].shot) return { valid: false };

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
    } else {
      return { valid: true, result: "miss", ship: null };
    }
  }

  randomShoot(): {
    valid: boolean;
    result?: string;
    ship?: Ship | null;
  } {
    const row: number = Math.floor(Math.random() * 10);
    const col: number = Math.floor(Math.random() * 10);

    if (this.board[row][col].shot) return { valid: false };

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
    } else {
      return { valid: true, result: "miss", ship: null };
    }
  }

  checkWithinBounds(row: number, col: number): boolean {
    if (row < 0 || row >= 10 || col < 0 || col >= 10) {
      return false;
    }

    return true;
  }

  allShipsSunk(): boolean {
    return this.ships.every((ship) => ship.isSunk());
  }
}
