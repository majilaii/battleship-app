"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playerSchema = void 0;
const index_1 = require("./index");
const Schema = index_1.mongoose.Schema;
exports.playerSchema = Schema.create({
    id: {
        type: Number,
        required: true,
    },
    own_grid: { type: Array, required: true },
});
