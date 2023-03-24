import { Board, Ship } from "./game";
export function generateRandomBoard(): Board {
  const board = new Board();

  // Create some ships with different names and sizes
  const carrier = new Ship("carrier", 5, "computer", "", []);
  const battleship = new Ship("battleship", 4, "computer", "", []);
  const cruiser = new Ship("cruiser", 3, "computer", "", []);
  const submarine = new Ship("submarine", 3, "computer", "", []);
  const destroyer = new Ship("destroyer", 2, "computer", "", []);

  // Place the ships on the board randomly

  // board.placeShipsRandom(carrier);
  // board.placeShipsRandom(battleship);
  // board.placeShipsRandom(cruiser);
  // board.placeShipsRandom(submarine);
  board.placeShipsRandom(destroyer);

  // Return the board
  return board;
}

export function generateBoard(): Board {
  const board = new Board();

  return board;
}
