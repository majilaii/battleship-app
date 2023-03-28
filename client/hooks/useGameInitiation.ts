import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";
import { ShipType } from "../components/Game";

type UseGameInitiationProps = {
  checkAllShipsPlaced: () => boolean;
  ships: ShipType[];
  startGame: boolean;
};

type GameInitiationResult = {
  initiateGame: () => Promise<{ message: string } | undefined>;
};

export default function useGameInitiation({
  ships,
  checkAllShipsPlaced,
  startGame,
}: UseGameInitiationProps): GameInitiationResult {
  async function initiateGame(): Promise<{ message: string } | undefined> {
    const result = await fetch("http://localhost:5000/singleplayer/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerShipPlacement: ships }),
    });
    const response = await result.json();
    return response;
  }

  useEffect(() => {
    if (checkAllShipsPlaced()) {
      initiateGame();
    }
  }, [startGame]);

  return {
    initiateGame,
  };
}
