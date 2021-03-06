import { MongoClient } from "mongodb";

export const projectId = process.env.PROJECT_ID || "603b65dbb9540a21983d3fa1";
export const port = process.env.PORT || "5000";
const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const mongoDbName = process.env.MONGODB_DB_NAME || "gavin-io";
const mongoDbUser = process.env.MONGODB_USER;
const mongoDbPassword = process.env.MONGODB_PWD;

export const createDb = async () => {
  const options = {
    useUnifiedTopology: true,
  };

  if (mongoDbUser && mongoDbPassword) {
    Object.assign(options, {
      auth: {
        user: mongoDbUser,
        password: mongoDbPassword,
      },
    });
  }

  const mongoClient = await MongoClient.connect(mongoUri, options);
  return mongoClient.db(mongoDbName);
};
