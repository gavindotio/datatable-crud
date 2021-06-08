import { map } from "lodash";

export const createGetHandler = (dao) => {
  return async (req, res) => {
    const id = req.params.id;
    const entityName = req.params.entityName;
    try {
      const data = await dao.findById({ id, entityName });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
};

export const createListHandler = (dao) => {
  return async (req, res) => {
    const entityName = req.params.entityName;
    try {
      const data = await dao.find({ entityName });
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
};

export const createRootHandler = (dao) => {
  return async (req, res) => {
    try {
      const entities = await dao.getEntityNames();
      res.json(
        map(entities, (entity) => {
          return {
            name: entity,
            listUrl: `/${entity}`,
          };
        })
      );
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  };
};
