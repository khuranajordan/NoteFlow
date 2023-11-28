import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const Connection = async () => {
  const URL = process.env.MONGODB_URI;
  try {
    await mongoose.connect(URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });
    console.log("Database connection successful!");
  } catch (error) {
    console.log("Error while connecting to db: ", error);
  }
};
