"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import BattleshipGrid from "./BattleshipGrid";
import ShipsMenu from "./ShipsMenu";
import { handlePlayerClickOnComputerGrid } from "../utils/singlePlayerUtils";
import GameOverModal from "./GameOverModal";

const AVAILABLE_SHIPS = [
  {
    col: null,
    row: null,
    name: "Carrier",
    size: 5,
    orientation: "horizontal",
    placed: false,
    valid: true,
    coordinates: [],
  },
  {
    col: null,
    row: null,
    name: "Battleship",
    orientation: "horizontal",
    size: 4,
    placed: false,
    valid: true,
    coordinates: [],
  },
  {
    col: null,
    row: null,
    name: "Cruiser",
    orientation: "horizontal",
    size: 3,
    placed: false,
    valid: true,
    coordinates: [],
  },
  {
    col: null,
    row: null,
    orientation: "horizontal",
    name: "Submarine",
    size: 3,
    placed: false,
    valid: true,
    coordinates: [],
  },
  {
    col: null,
    row: null,
    orientation: "horizontal",
    name: "Destroyer",
    size: 2,
    placed: false,
    valid: true,
    coordinates: [],
  },
];

export type ShipType = {
  col: number | null;
  row: number | null;
  orientation: string;
  name: string;
  size: number;
  placed: boolean;
  valid: boolean;
  coordinates: { row: number; col: number }[];
};

type GridProps = (string | null)[];

export default function Game() {
  const [playerGrid, setPlayerGrid] = useState<Array<GridProps>>(
    generateGrid()
  );
  const [computerGrid, setComputerGrid] = useState<Array<GridProps>>(
    generateGrid()
  );
  const [selectedShip, setSelectedShip] = useState<ShipType | null>(null);
  const [ships, setShips] = useState<ShipType[]>(AVAILABLE_SHIPS);
  const [startGame, setStartGame] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [whoWon, setWhoWon] = useState<"player" | "computer">("player");
  const [rightClicked, setRightClicked] = useState(false);

  // If right clicked to turn ship, we want to call handleMouseEnter function so we can immediately update the ship's direction in the frontend
  // handleMouseButton is sent as props for the onMouseEnter property in the individual buttons (cells)
  useEffect(() => {
    if (
      selectedShip &&
      selectedShip.row !== null &&
      selectedShip.col !== null
    ) {
      handleMouseEnter(selectedShip.row, selectedShip.col);
    }
  }, [rightClicked]);

  // Generating a 10x10 grid filled with nulls
  function generateGrid() {
    return new Array(10).fill(null).map(() => new Array(10).fill(null));
  }

  // Function for when we hover over cell
  function handleMouseEnter(row: number, col: number) {
    if (!selectedShip) return;

    const { orientation, size } = selectedShip;
    const valid = checkShipPlacement(row, col, size, orientation, playerGrid);
    // Function for the user to see where all the ship's squares will be placed on the grid
    const coordinates = hoverPlaceShipCoordinates(row, col, size, orientation);

    // Update Selected Ship as we hover over different cells
    setSelectedShip((prevShip) => {
      if (!prevShip) return null;
      return { ...prevShip, row, col, valid, coordinates };
    });
  }

  // Loop through selected ship's length and add the potential coordinates into the ship's coordinates array
  function hoverPlaceShipCoordinates(
    row: number,
    col: number,
    size: number,
    orientation: string
  ): { row: number; col: number }[] {
    const res = [];
    for (let i = 0; i < size; i++) {
      if (orientation === "horizontal") {
        res.push({ row, col: col + i });
      } else {
        res.push({ row: row + i, col });
      }
    }
    return res;
  }

  function checkShipPlacement(
    row: number,
    col: number,
    size: number,
    orientation: string,
    grid: GridProps[]
  ): boolean {
    // Checking if the ship we are going to place is going to be out of bounds
    if (
      (orientation === "horizontal" && col + size > 10) ||
      (orientation === "vertical" && row + size > 10) ||
      (orientation === "horizontal" && row < 0) ||
      (orientation === "vertical" && col < 0)
    ) {
      return false;
    }

    // Checking if the ship overlaps with other ships
    for (let i = 0; i < size; i++) {
      if (orientation === "horizontal") {
        if (grid[row][col + i] !== null) return false;
      } else {
        if (grid[row + i][col] !== null) return false;
      }
    }

    return true;
  }

  function handlePlayerCellClick(row: number, col: number) {
    if (!selectedShip || !selectedShip.valid) return;

    if (selectedShip) {
      const newPlayerGrid = placeShips(
        row,
        col,
        selectedShip.size,
        selectedShip.orientation,
        playerGrid
      );

      setPlayerGrid(newPlayerGrid);

      selectedShip.placed = true;

      setShips(
        ships.map((ship) =>
          ship.name === selectedShip.name
            ? {
                ...ship,
                row,
                col,
                orientation: selectedShip.orientation,
                placed: true,
              }
            : ship
        )
      );

      console.log(AVAILABLE_SHIPS);

      setSelectedShip(null);
    }
  }

  function placeShips(
    row: number,
    col: number,
    size: number,
    orientation: string,
    playerGrid: GridProps[]
  ) {
    console.log(orientation);

    //Make new grid from playergrid
    const newGrid = [...playerGrid.map((r) => [...r])];

    // Similar to backend, mark each spot occupied with the ship with the string 'ship', we will then add the colors on the playergrid in the Battleship component
    for (let i = 0; i < size; i++) {
      if (orientation === "horizontal") {
        newGrid[row][col + i] = "ship";
      } else {
        newGrid[row + i][col] = "ship";
      }
    }

    return newGrid;
  }

  function handleRightClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!selectedShip) {
      console.log("no ship selected");
      return;
    }

    setRightClicked((prevRightClicked) => !prevRightClicked);

    // Adjust selected ship's orientation
    setSelectedShip((prevShip) => {
      if (!prevShip) return null;
      const { row, col, size, orientation } = prevShip;
      const coordinates = hoverPlaceShipCoordinates(
        row as number,
        col as number,
        size,
        orientation
      );

      const newOrientation =
        orientation === "horizontal" ? "vertical" : "horizontal";
      return { ...prevShip, orientation: newOrientation, coordinates };
    });
  }

  async function handleComputerCellClick(row: number, col: number) {
    if (!startGame) return;

    // When the player clicks on computergrid, we will return the player's shoot result and also automatically trigger the computer to shoot the player's grid
    const response = await handlePlayerClickOnComputerGrid(row, col, startGame);

    // We then update the player's and the computer's grid according to the results
    if (response?.computerShootResult) {
      console.log(response.computerShootResult);
      const newGrid = [...playerGrid.map((r) => [...r])];

      const { result, row, col, ship } = response.computerShootResult;

      //If the returned result is You Win, we know the game is over and we trigger the Gameover modal
      if (result === "You Win" && ship) {
        for (let i = 0; i < ship.coordinates.length; i++) {
          const { row, col } = ship.coordinates[i];
          console.log({ i, row, col });
          newGrid[row][col] = "sunk";
        }
        setGameOver(true);
        setWhoWon("computer");
      }

      if (result === "hit") {
        newGrid[row][col] = "hit";
      }

      if (result === "sunk" && ship) {
        for (let i = 0; i < ship.coordinates.length; i++) {
          const { row, col } = ship.coordinates[i];
          console.log({ i, row, col });

          newGrid[row][col] = "sunk";
        }
      }

      if (result === "miss") {
        newGrid[row][col] = "miss";
      }

      setPlayerGrid(newGrid);
    }

    if (response?.playerShootResult) {
      const newGrid = [...computerGrid.map((r) => [...r])];

      const { result, row, col, ship } = response.playerShootResult;

      //If the returned result is You Win, we know the game is over and we trigger the Gameover modal
      if (result === "You Win" && ship) {
        for (let i = 0; i < ship.coordinates.length; i++) {
          const { row, col } = ship.coordinates[i];
          newGrid[row][col] = "sunk";
        }
        setGameOver(true);
        setWhoWon("player");
      }

      if (result === "hit") {
        newGrid[row][col] = "hit";
      }

      if (result === "sunk" && ship) {
        for (let i = 0; i < ship.coordinates.length; i++) {
          const { row, col } = ship.coordinates[i];
          newGrid[row][col] = "sunk";
        }
      }

      if (result === "miss") {
        newGrid[row][col] = "miss";
      }

      setComputerGrid(newGrid);
    }
  }

  function restartGame() {
    console.log(AVAILABLE_SHIPS);
    setShips(AVAILABLE_SHIPS);
    setPlayerGrid(generateGrid());
    setComputerGrid(generateGrid());
  }

  return (
    <section className="md:flex md:items-center md:justify-evenly grid grid-cols-1 ">
      <GameOverModal
        show={gameOver}
        winner={whoWon}
        onClose={() => {
          restartGame();
          setGameOver(false);
          setStartGame(false);
        }}
      />
      <ShipsMenu
        setSelectedShip={setSelectedShip}
        ships={ships}
        restartGame={restartGame}
        setStartGame={setStartGame}
        startGame={startGame}
      />
      <div
        onContextMenu={handleRightClick}
        className="hover: cursor-crosshair grid place-items-center"
      >
        <p className="text-blue-500 font-orbitron text-base mb-2">👤 Player:</p>
        <BattleshipGrid
          // We pass a isComputer Boolean through each grid so we can pass on different logic depending on the grid
          isComputer={false}
          grid={playerGrid}
          onCellClick={handlePlayerCellClick}
          onMouseEnter={(row: number, col: number) =>
            handleMouseEnter(row, col)
          }
          shipPlacement={selectedShip}
          startGame={startGame}
        />
      </div>
      <div className="hover: cursor-crosshair grid place-items-center">
        <p className="text-red-500 font-orbitron text-base mb-2">
          🤖 Computer:
        </p>
        <BattleshipGrid
          grid={computerGrid}
          onCellClick={handleComputerCellClick}
          isComputer={true}
        />
      </div>
    </section>
  );
}
