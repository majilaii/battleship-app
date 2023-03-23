"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = void 0;
const mongoose = require("mongoose");
exports.mongoose = mongoose;
mongoose.connect("mongodb://localhost:27017/battleship", {
    //didnt use .env here since it is a tech test
    useNewUrlParser: true,
    useUnifiedTopology: true,
});
