"use client";
import React, { useEffect } from "react";
import { useState } from "react";
import BattleshipGrid from "./BattleshipGrid";
import ShipsMenu from "./ShipsMenu";
import { handlePlayerClickOnComputerGrid } from "../utils/singlePlayerUtils";
import { useRouter } from "next/navigation";

const AVAILABLE_SHIPS = [
  {
    col: null,
    row: null,
    name: "Carrier",
    size: 5,
    orientation: "horizontal",
    placed: false,
  },
  {
    col: null,
    row: null,
    name: "Battleship",
    orientation: "horizontal",
    size: 4,
    placed: false,
  },
  {
    col: null,
    row: null,
    name: "Cruiser",
    orientation: "horizontal",
    size: 3,
    placed: false,
  },
  {
    col: null,
    row: null,
    orientation: "horizontal",
    name: "Submarine",
    size: 3,
    placed: false,
  },
  {
    col: null,
    row: null,
    orientation: "horizontal",
    name: "Destroyer",
    size: 2,
    placed: false,
  },
];

export type ShipType = {
  col: number | null;
  row: number | null;
  orientation: string;
  name: string;
  size: number;
  placed: boolean;
};

export type ShipPlacement = {
  row: number;
  col: number;
  size: number;
  orientation: string;
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
  const [computerShootResult, setComputerShootResult] = useState<Array<string>>(
    [""]
  );
  const [shipPlacement, setShipPlacement] = useState<ShipPlacement | null>(
    null
  );
  const [gameOver, setGameOver] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (selectedShip && selectedShip.row && selectedShip.col) {
      const { row, col, orientation, size } = selectedShip;
      const valid = checkShipPlacement(row, col, size, orientation, playerGrid);

      setShipPlacement({
        row,
        col,
        size,
        orientation,
        valid,
        coordinates: hoverPlaceShipCoordinates(row, col, size, orientation),
      });
    }
  }, [selectedShip, playerGrid]);

  function generateGrid() {
    return new Array(10).fill(null).map(() => new Array(10).fill(null));
  }

  function handleMouseEnter(row: number, col: number) {
    if (!selectedShip) return;

    const shipToPlace = ships.find((ship) => ship.name === selectedShip.name);

    if (!shipToPlace) return;

    const valid = checkShipPlacement(
      row,
      col,
      shipToPlace.size,
      shipToPlace.orientation,
      playerGrid
    );

    setShips(
      ships.map((ship) =>
        ship.name === selectedShip.name
          ? {
              ...ship,
              row,
              col,
              orientation: selectedShip.orientation,
            }
          : ship
      )
    );

    setSelectedShip((prevShip) => {
      if (!prevShip) return null;
      return { ...prevShip, row, col };
    });

    setShipPlacement({
      row,
      col,
      size: shipToPlace.size,
      orientation: shipToPlace.orientation,
      valid,
      coordinates: hoverPlaceShipCoordinates(
        row,
        col,
        shipToPlace.size,
        shipToPlace.orientation
      ),
    });
  }

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
    //Checking if the ship we are going to place is going to be out of bounds
    if (
      (orientation === "horizontal" && col + size > 10) ||
      (orientation === "vertical" && row + size > 10)
    ) {
      return false;
    }

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
    if (!shipPlacement || !shipPlacement.valid) return;

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
      setShipPlacement(null);
    }
  }

  function handleMouseLeave() {
    setShipPlacement(null);
  }

  function placeShips(
    row: number,
    col: number,
    size: number,
    orientation: string,
    playerGrid: GridProps[]
  ) {
    console.log(orientation);
    const newGrid = [...playerGrid.map((r) => [...r])];

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

    setSelectedShip((prevShip) => {
      if (!prevShip) return null;
      const newOrientation =
        prevShip.orientation === "horizontal" ? "vertical" : "horizontal";
      return { ...prevShip, orientation: newOrientation };
    });
  }

  async function handleComputerCellClick(row: number, col: number) {
    if (!startGame) return;
    console.log(row, col);

    const response = await handlePlayerClickOnComputerGrid(row, col, startGame);

    if (response?.computerShootResult) {
      const newGrid = [...playerGrid.map((r) => [...r])];

      const { result, row, col, ship } = response.computerShootResult;

      if (result === "You Win") {
        setGameOver(true);
        const queryParams = {
          whoWon: "computer",
        };
        const queryString = new URLSearchParams(queryParams).toString();
        router.push(`/gameover?${queryString}`);
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

      setPlayerGrid(newGrid);
    }

    if (response?.playerShootResult) {
      const newGrid = [...computerGrid.map((r) => [...r])];

      const { result, row, col, ship } = response.playerShootResult;

      if (result === "You Win" && ship) {
        for (let i = 0; i < ship.coordinates.length; i++) {
          const { row, col } = ship.coordinates[i];
          newGrid[row][col] = "sunk";
        }
        setGameOver(true);
        const queryParams = {
          whoWon: "player",
        };
        const queryString = new URLSearchParams(queryParams).toString();
        router.push(`/gameover?${queryString}`);
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
    <section className="flex items-center justify-evenly">
      <ShipsMenu
        setSelectedShip={setSelectedShip}
        ships={ships}
        restartGame={restartGame}
        setStartGame={setStartGame}
        startGame={startGame}
      />
      <div
        onMouseLeave={handleMouseLeave}
        onContextMenu={handleRightClick}
        className="hover: cursor-crosshair"
      >
        <p className="text-blue-500 font-orbitron text-base mb-2">Player:</p>
        <BattleshipGrid
          isComputer={false}
          grid={playerGrid}
          onCellClick={handlePlayerCellClick}
          onMouseEnter={(row: number, col: number) =>
            handleMouseEnter(row, col)
          }
          shipPlacement={shipPlacement}
        />
      </div>
      <div className="hover: cursor-crosshair">
        <p className="text-red-500 font-orbitron text-base mb-2">Computer:</p>
        <BattleshipGrid
          grid={computerGrid}
          onCellClick={handleComputerCellClick}
          isComputer={true}
        />
      </div>
    </section>
  );
}
