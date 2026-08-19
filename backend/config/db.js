import mongoose from "mongoose";

async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("successfully connected to database");
    } catch (error) {
        console.log("Error connecting to database");
        console.error(error.message);
        process.exit(1);
    }

}

export default connectDB;
