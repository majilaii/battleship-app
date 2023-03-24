import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { gameRouter } from "./routers/gameRouter";

const app: Express = express(); //Initiate Express App
app.use(express.json()); // Express bodyparser
const port = process.env.PORT || 5000; // Get PORT from .env, but since it is not going into production, this is not needed

const corsOptions = {
  origin: "*", // Allow any origin (this should not be the case in usual cases)
  methods: "GET,PUT,POST,PATCH,DELETE", // Allow these methods
  allowedHeaders: "Content-Type", // Allow these headers
  optionsSuccessStatus: 200, // Send this status for preflight requests
};
app.use(cors(corsOptions)); // Apply cors

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use(gameRouter);

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
