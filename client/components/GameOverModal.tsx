import React from "react";

type GameOverModalProps = {
  show: boolean;
  winner: "player" | "computer";
  onClose: () => void;
  amountShot: number;
  amountHit: number;
  amountSunk: number;
};

const GameOverModal: React.FC<GameOverModalProps> = ({
  show,
  winner,
  onClose,
  amountHit,
  amountSunk,
  amountShot,
}) => {
  if (!show) {
    return null;
  }

  const message =
    winner === "player"
      ? "You Win...Until Next Time!😠"
      : "You Lost To A Computer?!🤭";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="relative bg-white p-16 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        <p className="text-lg">
          {amountHit} successful hits <span className="text-gray-400">|</span>{" "}
          {amountSunk} ships sunk
        </p>
        <p className="text-lg">
          Shot accuracy:{" "}
          <span className="font-bold">
            {((amountHit / amountShot) * 100).toFixed(2)}%
          </span>
        </p>

        <button
          className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300"
          onClick={onClose}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
