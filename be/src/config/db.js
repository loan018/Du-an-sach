import mongoose from "mongoose";
import 'dotenv/config'

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_STRING);
    console.log("MongoDB kết nối thành công");
  } catch (error) {
    console.error("MongoDB kết nối không thành công:", error.message);
    process.exit(1);
  }
};

export default connectDB