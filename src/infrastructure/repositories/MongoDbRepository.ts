import { Collection, ObjectId, Db, Filter, WithId } from "mongodb";
import { IMongoDbRepository } from "../../domain/interfaces/repositories/IMongoDbRepostory";
import { SystemContextException } from "../../domain/exceptions/SystemContextException";

interface BaseDocument {
  _id?: ObjectId;
}

export class MongoDbRepository<T extends BaseDocument> implements IMongoDbRepository<T> {
  private collection: Collection<T>;

  constructor(db: Db, collectionName: string) {
    this.collection = db.collection<T>(collectionName);
  }

  async findAll(): Promise<WithId<T>[]> {
    return this.collection.find({}).toArray();
  }

  async findById(id: string): Promise<WithId<T> | null> {
    if (!ObjectId.isValid(id)) {
      throw new SystemContextException(`Invalid ObjectId: ${id}`);
    }

    const objectId = new ObjectId(id);
    return this.collection.findOne({ _id: objectId } as Filter<T>);
  }

  async deleteById(id: string): Promise<void> {
    if (!ObjectId.isValid(id)) {
      throw new SystemContextException(`Invalid ObjectId: ${id}`);
    }

    const objectId = new ObjectId(id);
    const result = await this.collection.deleteOne({ _id: objectId } as Filter<T>);

    if (result.deletedCount === 0) {
      throw new SystemContextException(`Document with ID ${id} not found`);
    }
  }
}
