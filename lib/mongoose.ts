import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);
  if (!process.env.MONGO_DB_URL) {
    return console.log("Missing MongoDB url");
  }
  if (isConnected) {
    return console.log("MongoDB is already connected");
  }
  try {
    await mongoose.connect(process.env.MONGO_DB_URL, {
      dbName: "devOverflow",
    });
    isConnected = true;
    console.log("Mongoose Connected");
  } catch (err) {
    console.log(err);
    throw err;
  }
};
