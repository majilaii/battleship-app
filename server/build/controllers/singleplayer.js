"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.startSinglePlayerGame = void 0;
const generateRandomGrid_1 = require("../utils/generateRandomGrid");
let playerTurn = true;
let playerGame;
let computerGame;
computerGame = (0, generateRandomGrid_1.generateRandomBoard)();
playerGame = (0, generateRandomGrid_1.generateBoard)();
function startSinglePlayerGame(req, res) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.startSinglePlayerGame = startSinglePlayerGame;
