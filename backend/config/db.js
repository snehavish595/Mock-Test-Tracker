import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Looks for Atlas string first, falls back to local if not found
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/rankflow';
    const conn = await mongoose.connect(mongoURI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;