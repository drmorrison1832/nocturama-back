require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Import custom errors class
const { AppError } = require("./utils/customErrors");

// Import modules
const express = require("express");

// Import middleware
const helmet = require("helmet");
const cors = require("cors");
const corsOptions = {
  origin: process.env.CLIENT_URL || `http://localhost:${process.env.PORT}`,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// Import custom middleware
const parseJSON = require("./utils/parseJSON");
const showReq = require("./middleware/showReq");
const handleError = require("./middleware/handleError");

// Create app
const app = express();

// Setup App
app.use(
  // limiter,
  helmet(),
  // cors(corsOptions),
  express.json({ limit: "150kb", verify: parseJSON }),
  express.urlencoded({ extended: true }),
  showReq
);

app.use("/api/articles", require("./routes/article-routes"));
app.use("/api/auth", require("./routes/user-routes"));

app.use(handleError);

app.all("/{*splat}", (req, res) => {
  return res.status(404).json({ status: "error", message: "Route not found" });
});

// Set up DB connection
const mongoose = require("mongoose");
async function connectDB() {
  try {
    await mongoose.connect(
      process.env.MONGODB_URI_REMOTE || process.env.MONGODB_URI_LOCAL
    );
    console.log("☎️  Connection to database sucessfull");

    await Promise.all([
      require("./models/user-model").init(),
      require("./models/article-model").init(),
    ]);
    console.log("✅ Database indexes created");
  } catch (error) {
    console.error("❌ Connection to database failed:", error);
    process.exit(1);
  }
}

// 🚀 Launch server
async function startServer() {
  await connectDB();
  app.listen(PORT, () => {
    console.info("🚀 Serveur started on port", PORT);
  });
}

startServer().catch(console.error);

// Handle uncaught exceptions
process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Promise Rejection:", error);
  process.exit(1);
});
