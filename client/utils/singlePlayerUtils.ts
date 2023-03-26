import { ShipType } from "../components/Game";
type Ship = {
  name: string;
  size: number;
  owner: "player" | "computer";
  orientation: string;
  coordinates: { row: number; col: number }[];
  hits: number;
};

type ClickReturnType = {
  valid: boolean;
  result: string;
  ship: Ship | null;
  row: number;
  col: number;
};

export async function fetchComputerClick(): Promise<ClickReturnType> {
  const result = await fetch("http://localhost:5000/singleplayer/shoot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ owner: "computer", row: 0, col: 0 }),
  });
  const response = await result.json();
  console.log(response);
  return response;
}

export async function handlePlayerClickOnComputerGrid(
  row: number,
  col: number,
  startGame: boolean
): Promise<
  | { playerShootResult: ClickReturnType; computerShootResult: ClickReturnType }
  | undefined
> {
  if (!startGame) return;

  const playerShootResult = await fetchPlayerClick(row, col);
  const computerShootResult = await fetchComputerClick();

  console.log(playerShootResult, computerShootResult);

  return { playerShootResult, computerShootResult };
}

export async function fetchPlayerClick(
  row: number,
  col: number
): Promise<ClickReturnType> {
  const result = await fetch("http://localhost:5000/singleplayer/shoot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ owner: "player", row, col }),
  });
  const response = await result.json();
  console.log(response);
  return response;
}
