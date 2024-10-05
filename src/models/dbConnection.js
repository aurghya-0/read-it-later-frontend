import mongoose, { mongo } from 'mongoose';

const dbUri = `mongodb://localhost:27017/article`;  // Replace 'article' with your database name

const connectDatabase = async () => {
    try {
        await mongoose.connect(dbUri);
        console.log('Database connected successfully...');
    } catch (error) {
        console.error('Failed to connect to the database:', error);
    }
};

connectDatabase();

export default mongoose;
