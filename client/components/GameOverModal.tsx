import React from "react";

type GameOverModalProps = {
  show: boolean;
  winner: "player" | "computer";
  onClose: () => void;
};

const GameOverModal: React.FC<GameOverModalProps> = ({
  show,
  winner,
  onClose,
}) => {
  if (!show) {
    return null;
  }

  const message =
    winner === "player"
      ? "You Win...Until Next Time!"
      : "You Lost To A Computer?!";

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black opacity-50"
      ></div>
      <div className="relative bg-white grid place-items-center p-16 rounded-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">{message}</h2>
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Restart
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
