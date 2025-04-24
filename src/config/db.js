import mongoose from "mongoose";

export const connectDB = async () => {
  const mongodb_uri = process.env.MONGODB_URI;
  try {
    const conn = await mongoose.connect(mongodb_uri, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000, 
    });
    console.log(`MongoDB Connected Successfully on ${conn.connection.host}`);
  } catch (error) {
    console.error("DB Connection Failed", error);
    process.exit(1);
  }
};
