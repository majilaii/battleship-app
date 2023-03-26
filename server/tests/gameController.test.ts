import {
  startGame,
  startGameRandom,
  shoot,
  reset,
  getBoard,
} from "../controllers/gameController";
import { Request, Response } from "express";
import { Board } from "../utils/gameClass";

describe("gameController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let status: jest.Mock;
  let json: jest.Mock;

  beforeEach(() => {
    status = jest.fn().mockReturnThis();
    json = jest.fn().mockReturnThis();
    req = {};
    res = {
      status,
      json,
    };
  });

  test("startGame should return 400 if req.body is empty", () => {
    req.body = {};
    startGame(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "req.body is empty" });
  });

  test("startGame should return 400 if req.body has invalid ship placements", () => {
    req.body = {
      playerShipPlacement: [
        {
          name: "destroyer",
          size: 8,
          orientation: "horizontal",
          row: 8,
          col: 0,
        },
        {
          name: "submarine",
          size: 2,
          orientation: "horizontal",
          row: 8,
          col: 0,
        },
      ],
    };
    startGame(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "Ship Placement Invalid" });
  });

  test("startGame should return 400 if req.body has invalid ship properties", () => {
    req.body = {
      playerShipPlacement: [
        {
          name: "destroyer",
          size: "8",
          orientation: "horizontal",
          row: 8,
          col: 0,
        },
        {
          name: "submarine",
          size: 2,
          orientation: "horizontal",
          row: 8,
          col: 0,
        },
      ],
    };
    startGame(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "Invalid input types" });
  });

  test("startGame should return 400 if req.body has does not contain an array of objects", () => {
    req.body = {
      playerShipPlacement: {
        name: "submarine",
        size: 2,
        orientation: "horizontal",
        row: 8,
        col: 0,
      },
    };
    startGame(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({ message: "Invalid input types" });
  });

  test("startGameRandom should return 200 and start the game with random placement", () => {
    startGameRandom(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      message: "Ships Placements Successful",
    });
  });

  test("shoot should return 400 if req.body is empty", () => {
    req.body = {};
    shoot(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      message: "Bad Request: req.body is empty",
    });
  });

  test("reset should return 200 and reset the game", () => {
    reset(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: "Game Reset Successfully!" });
  });

  test("getBoard should return 200 and the player's board", () => {
    const playerGame = new Board();
    getBoard(req as Request, res as Response);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({ message: playerGame });
  });
});
