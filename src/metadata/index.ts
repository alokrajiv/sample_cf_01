import { MongoClient, Db } from "mongodb";
const MONGODB_URI = process.env.MONGODB_URI; // or Atlas connection string

let cachedDb: Db = undefined;

async function connectToDatabase (uri: string, dbName: string) {
  console.log("=> connect to database");

  if (cachedDb) {
    console.log("=> using cached database instance");
    return Promise.resolve(cachedDb);
  }

  const _client = await MongoClient.connect(uri);
  cachedDb = _client.db(dbName);
  return cachedDb;
}

async function queryDatabase (db: Db) {
  console.log("=> query database");

  try {
    await db.collection("metadata").find({}).toArray();
    return { statusCode: 200, body: "success" };
  }
  catch (err) {
    console.log("=> an error occurred: ", err);
    return { statusCode: 500, body: "error" };
  }
}

exports.handler = async (event: any, context: any) => {
  context.callbackWaitsForEmptyEventLoop = false;

  console.log("event: ", event);

  try {
    const db = await connectToDatabase(process.env.MONGODB_URI, process.env.MONGODB_DBNAME);
    const result = await queryDatabase(db);
    console.log("=> returning result: ", result);
  } catch (error) {
    console.log("=> an error occurred: ", error);
    console.log(process.env.MONGODB_URI);
    throw error;
  }
};
