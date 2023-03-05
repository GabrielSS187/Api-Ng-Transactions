import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { AddressInfo } from "net";
import path from "path";

import "./services/translationsYup";

export const app: Express = express();

dotenv.config();

app.use("/files", express.static(path.resolve("src/tmp")));

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
   if (server) {
      const address = server.address() as AddressInfo;
      console.log(`Server is running in http://localhost:${address.port}`);
   } else {
      console.error(`Failure upon starting server.`);
   };
});