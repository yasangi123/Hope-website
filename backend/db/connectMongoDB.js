import mongoose from "mongoose";

// Function to connect to MongoDB using Mongoose
const connectMongoDB = async () => {
    try {
        // Attempting to connect to MongoDB using the connection URI from environment variables
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB connected: ${conn.connection.host}`); // Logging the connection host on success
    } catch (error) {
        // Logging an error message if connection fails
        console.error('Error connecting to MongoDB: ${error.message}');
        process.exit(1); // Exiting the process with failure code
    }
}

export default connectMongoDB;
