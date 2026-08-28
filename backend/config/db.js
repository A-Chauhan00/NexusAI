// import mongoose from "mongoose";

// async function connectDB() {
//     try {
//         await mongoose.connect(process.env.MONGO_URI);
//         console.log("successfully connected to database");
//     } catch (error) {
//         console.log("Error connecting to database");
//         console.error(error.message);
//         process.exit(1);
//     }

// }

// export default connectDB;

import mongoose from "mongoose";


let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  
  if (cached.conn) {
    return cached.conn;
  }

  
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, 
    };

    cached.promise = mongoose.connect(process.env.MONGO_URI, opts).then((mongooseInstance) => {
      console.log("successfully connected to database");
      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null; 
    console.log("Error connecting to database");
    console.error(error.message);
 
    throw error;
  }

  return cached.conn;
}

export default connectDB;
