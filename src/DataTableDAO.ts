import { Db, ObjectID } from "mongodb";
import { reduce } from "lodash";

export class DataTableDAO {
  private readonly collection;
  private readonly schemaCollection;
  private readonly dataTableId;
  private tableSchema;

  constructor({ db, dataTableId }: { db: Db; dataTableId: string }) {
    this.schemaCollection = db.collection("dataTableSchemas");
    this.collection = db.collection(dataTableId);
    this.dataTableId = dataTableId;
  }

  async getTableSchema() {
    if (!this.tableSchema) {
      this.tableSchema = await this.schemaCollection.findOne({
        _id: ObjectID(this.dataTableId),
      });
    }

    return this.tableSchema;
  }

  async findById({ id }: { id: string }) {
    const tableSchema = await this.getTableSchema();
    console.log(JSON.stringify(tableSchema));

    return this.fromDb(
      await this.collection.findOne({ _id: ObjectID(id) }),
      tableSchema
    );
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
