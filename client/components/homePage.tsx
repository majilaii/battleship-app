import Link from "next/link";
import React from "react";

export default function HomePage() {
  return (
    <section>
      <div className="w-screen h-screen grid grid-rows-2 grid-cols-1 place-items-center ">
        <h1 className="text-9xl font-bold ">BATTLESHIP</h1>
        <div className="flex flex-row gap-5 w-full h-full justify-center items-start">
          <Link
            href="/singleplayer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl"
          >
            SinglePlayer
          </Link>
          <Link
            href="/multiplayer"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-2xl"
          >
            Multiplayer
          </Link>
        </div>
      </div>
    </section>
  );
}
