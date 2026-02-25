import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    // Use MongoDB Atlas from environment variable
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      console.error('MONGODB_URI not found in environment variables');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('MongoDB connected successfully to:', mongoose.connection.name);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export default connectDB;

