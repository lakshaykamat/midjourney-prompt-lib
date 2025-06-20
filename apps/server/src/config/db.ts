import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const URI = process.env.MONGO_URI
    await mongoose.connect(URI as string);
    console.log('MongoDB connected--' + URI);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}