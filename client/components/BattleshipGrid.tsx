import React from "react";
import { ShipType } from "./Game";

type GridProps = {
  isComputer: boolean;
  onCellClick?: (row: number, col: number) => void;
  grid: (string | null)[][];
  onMouseEnter?: (row: number, col: number) => void;
  shipPlacement?: ShipType | null;
  startGame?: boolean;
};

export default function BattleshipGrid({
  isComputer,
  onCellClick,
  grid,
  onMouseEnter,
  shipPlacement,
  startGame,
}: GridProps) {
  // This function will be called for each cell when we map out the player's and computer's grid, we will then return individual tailwind className strings for each of the grid's state
  function getCellBackgroundColor(row: number, col: number) {
    const cellData = grid[row][col];
    if (cellData === "hit") {
      return "bg-red-500";
    } else if (cellData === "miss") {
      return "bg-gray-400";
    } else if (cellData === "sunk") {
      return "bg-black";
    } else if (!isComputer && cellData === "ship") {
      return "bg-blue-500";
    } else {
      return "bg-gray-200";
    }
  }

  // For when the user is hovering and placing a ship, if the cell itself is included selectedShips's coordinates array, we will return either blue or red depending on the validity of the placement
  function getCellBackgroundColorHover(row: number, col: number) {
    if (!shipPlacement?.coordinates) return;

    for (let i = 0; i < shipPlacement?.coordinates.length; i++) {
      if (
        shipPlacement.coordinates[i].row === row &&
        shipPlacement.coordinates[i].col === col
      ) {
        if (!shipPlacement.valid) {
          return "bg-red-300";
        }
        return "bg-blue-300 ";
      }
    }
  }

  return (
    <div className="grid grid-cols-10 border-2 border-solid border-gray-600 w-4/6 md:w-full ">
      {grid.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((_col, colIndex) => (
            <div
              key={colIndex}
              className={`w-10 h-10 border border-gray-300 text-center ${
                !isComputer && shipPlacement && !shipPlacement.valid
                  ? "hover:bg-red-500"
                  : !isComputer && shipPlacement && shipPlacement.valid
                  ? "hover:bg-blue-500"
                  : "hover:bg-gray-500 "
              } ${
                !startGame && getCellBackgroundColorHover(rowIndex, colIndex)
              } ${getCellBackgroundColor(rowIndex, colIndex)}
               `}
              onClick={() => {
                if (!isComputer) {
                  if (shipPlacement && onCellClick && shipPlacement.valid) {
                    onCellClick(rowIndex, colIndex);
                  }
                } else if (isComputer && onCellClick) {
                  onCellClick(rowIndex, colIndex);
                }
              }}
              onMouseEnter={() =>
                onMouseEnter && onMouseEnter(rowIndex, colIndex)
              }
            ></div>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}
