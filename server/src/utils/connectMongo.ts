import mongoose from 'mongoose';

const connectMongo = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error('MONGO_URI environment variable is not defined');
  }

  await mongoose.connect(mongoUri);
};

export default connectMongo;
