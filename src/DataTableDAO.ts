import { Db, ObjectID } from "mongodb";
import { map, reduce } from "lodash";

export class DataTableDAO {
  // private readonly collection;
  private readonly schemaCollection;
  private readonly projectId;
  private readonly db;
  private tableSchema = [];

  constructor({ db, projectId }: { db: Db; projectId: string }) {
    this.schemaCollection = db.collection("dataTableSchemas");
    this.db = db;
    // this.collection = db.collection(dataTableId);
    this.projectId = projectId;
  }

  async getTableSchema({ entityName }) {
    if (!this.tableSchema[entityName]) {
      const schema = await this.schemaCollection.findOne({
        projectId: this.projectId,
        name: entityName,
      });

      this.tableSchema[entityName] = schema;
      console.log({ schema });
    }

    return this.tableSchema[entityName];
  }

  async findById({ id, entityName }: { id: string; entityName: string }) {
    const tableSchema = await this.getTableSchema({ entityName });
    console.log(JSON.stringify(tableSchema));

    if (!tableSchema) {
      throw new Error(
        `Table ${entityName} not found in project ${this.projectId}`
      );
    }

    const collection = this.db.collection(tableSchema._id.toString());
    return this.fromDb(
      await collection.findOne({ _id: ObjectID(id) }),
      tableSchema
    );
  }

  async find({ entityName }: { entityName: string }) {
    const tableSchema = await this.getTableSchema({ entityName });
    console.log(JSON.stringify(tableSchema));

    if (!tableSchema) {
      throw new Error(
        `Table ${entityName} not found in project ${this.projectId}`
      );
    }

    const collection = this.db.collection(tableSchema._id.toString());
    const results = await collection
      .find(
        {},
        {
          limit: 50,
        }
      )
      .toArray();

    console.log({ results });

    return map(results, (result) => {
      return this.fromDb(result, tableSchema);
    });
  }

  fromDb(dbEntity, tableSchema) {
    if (!dbEntity) {
      return;
    }

    const fields = reduce(
      tableSchema.fields,
      (memo, { id, name }) => {
        return {
          ...memo,
          [name]: dbEntity[`f_${id}`],
        };
      },
      {}
    );
    return {
      id: dbEntity._id.toString(),
      ...fields,
    };
  }
}
