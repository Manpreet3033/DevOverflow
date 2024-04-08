import mongoose, { Mongoose } from "mongoose";

const MONGO_DB_URL = process.env.MONGO_DB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null,
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn;
  }
  mongoose.set("strictQuery", true);
  if (!MONGO_DB_URL) {
    return console.log("Missing MongoDB url");
  }
  try {
    cached.promise =
      cached.promise ||
      mongoose.connect(MONGO_DB_URL, {
        dbName: "devOverflow",
      });
    cached.conn = await cached.promise;
    console.log("Mongoose Connected");
    return cached.conn;
  } catch (err) {
    console.log(err);
    throw err;
  }
};
