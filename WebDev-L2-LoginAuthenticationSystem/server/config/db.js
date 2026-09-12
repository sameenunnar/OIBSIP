const mongoose = require("mongoose");

let connectionPromise;

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/login_authentication";

  mongoose.set("strictQuery", true);
  connectionPromise = mongoose.connect(uri)
    .then(() => {
      console.log(`[db] MongoDB connected -> ${mongoose.connection.host}/${mongoose.connection.name}`);
      return mongoose.connection;
    })
    .catch((err) => {
      connectionPromise = undefined;
      console.error("[db] MongoDB connection failed:", err.message);
      throw err;
    });

  return connectionPromise;
}

module.exports = connectDB;
