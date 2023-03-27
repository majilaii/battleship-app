import React, { useEffect } from "react";
import { useState } from "react";
import { Dispatch, SetStateAction } from "react";
import { ShipType } from "./Game";

type ShipsMenuProps = {
  ships: ShipType[];
  setSelectedShip: Dispatch<SetStateAction<ShipType | null>>;
  setStartGame: Dispatch<SetStateAction<boolean>>;
  restartGame: () => void;
  startGame: boolean;
};

export default function ShipsMenu({
  setSelectedShip,
  ships,
  restartGame,
  setStartGame,
  startGame,
}: ShipsMenuProps) {
  const [selectedButton, setSelectedButton] = useState<number | null>();

  useEffect(() => {
    setSelectedButton(null);
  }, [startGame]);

  //When all ships are placed, the user can initiate game and this will call the game endpoint in the backend
  async function initiateGame() {
    if (!checkAllShipsPlaced()) return;

    setStartGame(true);

    const result = await fetch("http://localhost:5000/singleplayer/game", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerShipPlacement: ships }),
    });
    const response = await result.json();
    console.log(response);
    return response;
  }

  function checkAllShipsPlaced() {
    return ships.every((ship) => ship.placed);
  }

  return (
    <section className=" flex flex-col justify-evenly items-center gap-4 md:w-1/5 ">
      <h1 className=" text-red-500 font-orbitron text-2xl ">Your Ships⚓</h1>
      {!checkAllShipsPlaced() && !startGame ? (
        <>
          {ships.map((element, index) => {
            //If the ship is already placed, dont render it in the menu
            if (element.placed) return null;

            return (
              <React.Fragment key={index}>
                <button
                  onClick={() => {
                    setSelectedButton(index);
                    setSelectedShip(ships[index]);
                  }}
                  className={` w-3/6 h-13 flex justify-between p-2 items-center border-2 border-solid bg-blue-500 border-blue-500 rounded-sm  shadow-md transform active:scale-95 active:translate-y-1 transition duration-150 ease-in-out hover:opacity-60 ${
                    selectedButton === index && `opacity-60`
                  }`}
                >
                  <p className="font-orbitron text-white"> {element.name} </p>
                  <div className="flex ">
                    <>
                      {Array.from({ length: element.size }).map((_, index) => (
                        <div
                          key={index}
                          className="w-3 h-3  md:w-2 md:h-2 border-[1px] border-solid border-yellow-500 bg-yellow-300"
                        ></div>
                      ))}
                    </>
                  </div>
                </button>
              </React.Fragment>
            );
          })}
          <p className="w-4/6 text-center text-xs">
            Right click to rotate your ship
          </p>
          <button
            className="text-red-500 underline text-sm"
            onClick={restartGame}
          >
            Restart
          </button>
        </>
      ) : checkAllShipsPlaced() && !startGame ? (
        <>
          <p>Ships are ready</p>
          <button
            onClick={initiateGame}
            className="bg-red-500 hover:bg-red-700 text-white  py-4 px-6 rounded text-base"
          >
            {" "}
            Start Game
          </button>
        </>
      ) : (
        <p className="font-semibold">The Battle Begins! ⚓</p>
      )}
    </section>
  );
}
