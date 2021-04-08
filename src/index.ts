import * as express from "express";
import { createDb, port, dataTableId } from "./config";
import { createGetHandler } from "./createHandler";
import { DataTableDAO } from "./DataTableDAO";

const app = express();
const nPort = parseInt(port);

const setup = async () => {
  const db = await createDb();
  const dao = new DataTableDAO({ db, dataTableId });
  app.get("/:id", createGetHandler(dao));
};

setup().then(() => {
  app.listen(nPort, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
