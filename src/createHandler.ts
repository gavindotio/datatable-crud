export const createGetHandler = (dao) => {
  return async (req, res) => {
    const id = req.params.id;
    const data = await dao.findById({ id });
    res.json(data);
  };
};
