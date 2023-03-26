import React from "react";

export default function Header({ className }: { className: string }) {
  return (
    <section className={`${className} flex justify-center items-center `}>
      <h1 className="text-blue-800 text-4xl  font-medium font-orbitron">
        Battleship Dupe
      </h1>
    </section>
  );
}
