import { MongoClient, Db } from "mongodb";

let cachedDb: Db = undefined;

async function connectToDatabase (uri: string, dbName: string) {
  console.log("=> connect to database");

  if (cachedDb) {
    console.log("=> using cached database instance");
    return Promise.resolve(cachedDb);
  }

  const _client = await MongoClient.connect(uri, { useUnifiedTopology: true });
  cachedDb = _client.db(dbName);
  return cachedDb;
}

async function queryDatabase (db: Db) {
  console.log("=> query database");
  return db.collection("metadata").find({}).toArray();
}

exports.handler = async (event: any, context: any) => {
  // // Commenting best practise as per MongoDB Atlas.
  // context.callbackWaitsForEmptyEventLoop = false;

  console.log("event: ", event);

  try {
    const db = await connectToDatabase(process.env.MONGODB_CONNSTR, process.env.MONGODB_DBNAME);
    const result = await queryDatabase(db);
    console.log("=> returning result: ", result);
    return { statusCode: 200, body: JSON.stringify(result) };
  } catch (error) {
    console.log("=> an error occurred: ", error);
    console.log(process.env.MONGODB_CONNSTR);
    throw error;
  }
};
