const mongoose = require("mongoose");

const connectDB = async () => {
  // Mongoose connection event listeners for better logging
  mongoose.connection.on("connected", () => {
    console.log("✅ MongoDB successfully connected");
  });

  mongoose.connection.on("error", (err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.log("⚠️ MongoDB disconnected");
  });

  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI is not set in .env. Backend will start without a DB connection.");
      return false;
    }

    console.log("🔄 Connecting to MongoDB Atlas...");
    // Attempt to connect to MongoDB Atlas with a 5s timeout
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    
    return true;
  } catch (error) {
    console.error("❌ MongoDB connection failed on initial load.");
    console.error("Details:", error?.message || error);
    
    // Check specifically for IP Whitelist errors
    if (error?.message?.includes("IP that isn't whitelisted") || error?.message?.includes("Could not connect to any servers")) {
      console.log("⚠️ MongoDB Atlas connection restricted or offline. Starting local in-memory MongoDB fallback...");
      try {
        const { MongoMemoryServer } = require("mongodb-memory-server");
        const mongoServer = await MongoMemoryServer.create();
        const mongoUri = mongoServer.getUri();
        console.log("🚀 In-memory MongoDB server started at:", mongoUri);
        await mongoose.connect(mongoUri);
        console.log("✅ Connected to in-memory database fallback successfully.");
        return true;
      } catch (memError) {
        console.error("❌ Failed to start in-memory MongoDB fallback:", memError.message);
        return false;
      }
    }
    
    return false;
  }
};

module.exports = connectDB;
