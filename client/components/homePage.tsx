import Link from "next/link";
import React from "react";
import { Orbitron, Bangers } from "next/font/google";

export default function HomePage() {
  return (
    <div className="w-screen min-h-screen  min-h-[100dvh] flex flex-col justify-center items-center gap-10">
      <div>
        <h1 className="text-5xl font-bold text-center text-blue-800 font-orbitron">
          BATTLESHIP DUPE
        </h1>
        <h2 className="text-center text-xl text-blue-300 font-orbitron">
          {" "}
          A navy strategy game⚓
        </h2>
      </div>
      <div className="flex flex-col items-center">
        <h2 className="text-2xl font-medium text-red-500 text-center font-orbitron">
          Rules
        </h2>
        <p className="text-center w-2/6">
          You and your opponent are navy commanders. You have secretly placed
          your fleet at sea and they have too. Fire torpedos at the enemy and
          sink their ships! The first to sink the other's entire fleet wins the
          game!
        </p>
      </div>
      <div className="flex flex-row gap-5 w-full justify-center items-start">
        <Link
          href="/singleplayer"
          className="bg-blue-500 hover:bg-blue-700 text-white  py-4 px-6 rounded text-base"
        >
          Play Now
        </Link>
      </div>
    </div>
  );
}
