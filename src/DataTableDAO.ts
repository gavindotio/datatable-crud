import { Db, ObjectID } from "mongodb";
import { isInteger, isUndefined, map, reduce } from "lodash";

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
    }

    return this.tableSchema[entityName];
  }

  async getEntityNames() {
    const schemas = await this.schemaCollection
      .find({
        projectId: this.projectId,
      })
      .toArray();

    return map(schemas, "name");
  }

  async findById({ id, entityName }: { id: string; entityName: string }) {
    const tableSchema = await this.getTableSchema({ entityName });

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
      (memo, { id, name, dataType }) => {
        const sval = dbEntity[`f_${id}`];
        let val = sval;
        if (dataType === "INT") {
          const ival = parseInt(val);
          if (isInteger(ival)) {
            val = ival;
          }
        }
        return {
          ...memo,
          [name]: isUndefined(val) ? null : val,
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
