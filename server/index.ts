import * as dotenv from "dotenv";
import cors from "cors";
dotenv.config();
import express, { Express, Request, Response } from "express";
import { gameRouter } from "./routers/gameRouter";

console.log("hi");

const app: Express = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: "*", // Allow any origin
  methods: "GET,PUT,POST,PATCH,DELETE", // Allow these methods
  allowedHeaders: "Content-Type", // Allow these headers
  optionsSuccessStatus: 200, // Send this status for preflight requests
};
app.use(cors(corsOptions));

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

app.use(gameRouter);

app.listen(port, () => {
  console.log(`server is running at http://localhost:${port}`);
});
