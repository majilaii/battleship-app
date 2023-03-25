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

  unshotCells: Set<string>;

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

  placeShipsManual(
    row: number,
    col: number,
    ship: Ship,
    orientation: "horizontal" | "vertical"
  ): boolean {
    // Checking if the placement of the ship is valid
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
    // If orientation is horizontal, we add all the coordinates to the ship instance and modify the ship and occupied property on each cell it is on
    for (let i = 0; i < ship.size; i++) {
      if (orientation === "horizontal") {
        this.board[row][col + i].occupied = true;
        this.board[row][col + i].ship = ship;
        ship.coordinates.push({ row, col: col + i });
      } else {
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

  placeShipsRandom(ship: Ship): void {
    let row: number = 0;
    let col: number = 0;
    let valid: boolean;

    // Loop until a valid position is found
    while (true) {
      // Pick a random starting cell
      row = Math.floor(Math.random() * 10);
      col = Math.floor(Math.random() * 10);

      // Check if the ship fits in the board without overlapping
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

      if (valid) break; // If a valid position is found, exit the loop
    }

    // Place the ship on the board and update the board array
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

    // Add to board's ship array
    this.ships.push(ship);
  }

  shoot(
    row: number,
    col: number
  ): {
    valid: boolean;
    result?: string;
    ship?: Ship | null;
    row: number;
    col: number;
  } {
    // Check if the row and col coordinates are in bound
    if (!this.checkWithinBounds(row, col))
      return { valid: false, row: -1, col: -1 };

    // Check if the cell has already been shot
    if (this.board[row][col].shot)
      return { valid: false, result: "Already shot", row, col };

    // If not, mark the cell as shot
    this.board[row][col].shot = true;

    // Delete the key-value from the unshotCells set
    this.unshotCells.delete(`${row}-${col}`);

    // Check if the cell contains a ship
    const ship = this.board[row][col].ship;

    // If there is no ship, return miss
    if (!ship) {
      return { valid: true, result: "miss", ship: null, row, col };
    }

    // If there is a ship, increase hit count
    ship.hit();

    // If the ship is sunk, check if all ships are sunk
    if (ship.isSunk()) {
      const result = this.allShipsSunk() ? "You Win" : "sunk";
      return { valid: true, result, ship, row, col };
    }

    // If the ship is not sunk, return hit
    return { valid: true, result: "hit", ship: null, row, col };
  }

  randomShoot(): {
    valid: boolean;
    result?: string;
    ship?: Ship | null;
    row: number;
    col: number;
  } {
    if (this.unshotCells.size === 0) {
      return {
        valid: false,
        result: "No more cells to shoot",
        ship: null,
        row: -1,
        col: -1,
      };
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
      return { valid: true, result: "miss", ship: null, row, col };
    }

    // If there is a ship, increase hit count
    ship.hit();

    // If the ship is sunk, check if all ships are sunk
    if (ship.isSunk()) {
      const result = this.allShipsSunk() ? "You Win" : "sunk";
      return { valid: true, result, ship, row, col };
    }

    // If the ship is not sunk, return hit
    return { valid: true, result: "hit", ship, row, col };
  }

  shootIntelligently(): {
    valid: boolean;
    result?: string;
    ship?: Ship | null;
  } {
    // Find hit cells and their neighbors
    const hitCells: { row: number; col: number }[] = [];
    const hitCellsNeighbors: { row: number; col: number }[] = [];

    // Loop through the entire board to find all hit cells
    //(this process is a bit inefficient but since it's only looping 1 to 100, it makes it not as bad)
    for (let i = 0; i < 10; i++) {
      for (let j = 0; j < 10; j++) {
        // If the cell is shot and has a ship
        if (this.board[i][j].shot && this.board[i][j].ship) {
          // We first add it to the hit array
          hitCells.push({ row: i, col: j });

          const neighbors = [
            { row: i - 1, col: j },
            { row: i + 1, col: j },
            { row: i, col: j - 1 },
            { row: i, col: j + 1 },
          ];

          // Add all of the hit cell's neighbors onto the hitCellsNeighbors array if they fit the right conditions
          for (const neighbor of neighbors) {
            if (
              this.checkWithinBounds(neighbor.row, neighbor.col) &&
              !this.board[neighbor.row][neighbor.col].shot &&
              this.board[neighbor.row][neighbor.col].ship
            ) {
              hitCellsNeighbors.push(neighbor);
            }
          }
        }
      }
    }

    // If there are unshot neighbors, shoot at one of them
    if (hitCellsNeighbors.length !== 0) {
      const randomElement =
        hitCellsNeighbors[Math.floor(Math.random() * hitCellsNeighbors.length)];
      return this.shoot(randomElement.row, randomElement.col);
    }

    // Otherwise shoot randomly
    return this.randomShoot();
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
