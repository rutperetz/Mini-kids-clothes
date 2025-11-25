import mongoose from 'mongoose';

/*Connecting the server to MongoDB.*/

export async function connectDB() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.DB_NAME || 'shopdb';

  if (!uri) {
    console.error('MONGODB_URI missing in .env file (in server folder)');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri, { dbName });

    console.log('MongoDB connected:', dbName);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
}
