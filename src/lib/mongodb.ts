/* eslint-disable @typescript-eslint/no-explicit-any */
// import mongoose from "mongoose";

// const MONGODB_URI = process.env.MONGO;

// if (!MONGODB_URI) {
//   throw new Error("Please define mongo environment variant");
// }

// async function connectToDatabase() {
//   if (mongoose.connection.readyState === 1) {
//     return mongoose;
//   }

//   const opts = {
//     bufferCommands: false,
//   };

//   await mongoose.connect(MONGODB_URI!, opts);
//   return mongoose;
// }

// export default connectToDatabase;

import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO;

if (!MONGODB_URI) {
  throw new Error("Please define mongo environment variant");
}

// Khai báo kiểu rõ ràng cho cached
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Type assertion để tránh lỗi
const cached: MongooseCache = (global as any).mongoose || {
  conn: null,
  promise: null,
};

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectToDatabase;
