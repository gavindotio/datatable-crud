import * as express from "express";
import { createDb, port, projectId } from "./config";
import {
  createGetHandler,
  createListHandler,
  createRootHandler,
} from "./createHandler";
import { DataTableDAO } from "./DataTableDAO";

const app = express();
const nPort = parseInt(port);

const setup = async () => {
  const db = await createDb();
  const dao = new DataTableDAO({ db, projectId });
  app.get("/", createRootHandler(dao));
  app.get("/:entityName/:id", createGetHandler(dao));
  app.get("/:entityName", createListHandler(dao));
};

setup().then(() => {
  app.listen(nPort, () => {
    console.log(
      `datatable-crud app listening at http://localhost:${port} PROJECT_ID=${projectId}`
    );
  });
});
