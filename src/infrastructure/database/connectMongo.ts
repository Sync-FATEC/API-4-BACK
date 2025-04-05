import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL!;
export const mongoClient = new MongoClient(uri);

let isConnected = false;

export async function connectMongo() {
  if (!isConnected) {
    await mongoClient.connect();
    isConnected = true;
  }

  return mongoClient.db(process.env.MONGO_DATABASE);
}
