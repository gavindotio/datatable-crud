import * as express from "express";
import { createDb, port, projectId } from "./config";
import { createGetHandler, createListHandler } from "./createHandler";
import { DataTableDAO } from "./DataTableDAO";

const app = express();
const nPort = parseInt(port);

const setup = async () => {
  const db = await createDb();
  const dao = new DataTableDAO({ db, projectId });
  app.get("/:entityName/:id", createGetHandler(dao));
  app.get("/:entityName", createListHandler(dao));
};

setup().then(() => {
  app.listen(nPort, () => {
    console.log(`Example app listening at http://localhost:${port}`);
  });
});
