import React from "react";
import { ShipPlacement } from "./Game";

type GridProps = {
  isComputer: boolean;
  onCellClick?: (row: number, col: number) => void;
  grid: (string | null)[][];
  onMouseEnter?: (row: number, col: number) => void;
  shipPlacement?: ShipPlacement | null;
};

export default function BattleshipGrid({
  isComputer,
  onCellClick,
  grid,
  onMouseEnter,
  shipPlacement,
}: GridProps) {
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

  function getCellBackgroundColorHover(row: number, col: number) {}

  return (
    <div className="grid grid-cols-10 border-2 border-solid border-gray-600">
      {grid.map((row, rowIndex) => (
        <React.Fragment key={rowIndex}>
          {row.map((_col, colIndex) => (
            <div
              key={colIndex}
              className={`w-10 h-10 border border-gray-300 text-center  hover:bg-blue-500 ${getCellBackgroundColor(
                rowIndex,
                colIndex
              )} `}
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
