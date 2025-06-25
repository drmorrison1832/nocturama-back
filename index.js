console.warn("\n🏁 Starting app");
require("dotenv").config();
const PORT = process.env.PORT || 3000;

// Import modules
const express = require("express");

// Import middleware
const morgan = require("morgan");
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
  morgan("dev", { immediate: false }),
  helmet(),
  // cors(corsOptions),
  express.json({ limit: "150kb", verify: parseJSON }),
  express.urlencoded({ extended: true })
  // showReq
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
  console.log("☎️  Connecting to database...");
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
  const server = app.listen(PORT, () => {
    console.info("🚀 Serveur started on port", PORT);

    // Handle uncaught exceptions & other unexpected terminations
    process.on("SIGTERM", async () => {
      console.warn("SIGTERM signal received");
      await closeServer(0);
    });

    process.on("SIGINT", async () => {
      console.warn("SIGNINT signal received: closing server");
      await closeServer(0);
    });

    process.on("uncaughtException", async (error) => {
      console.error("❌ Uncaught Exception:", error);
      await closeServer(1);
    });

    process.on("unhandledRejection", async (error) => {
      console.error("❌ Unhandled Promise Rejection:", error);
      await closeServer(1);
    });

    async function closeServer(code) {
      console.info("Disconnecting from database...");
      try {
        await mongoose.disconnect();
        console.info("Successfully disconnected from database");
        console.info("Closing server...");
        server.close(() => {
          console.info("Server closed");
          process.exit(code);
        });
      } catch (error) {
        console.error("❌ Error during shutdown:", error);
        server.close(() => {
          console.warn("Server closed (after DB error)");
          process.exit(code);
        });
      }
    }
  });
}

startServer().catch(console.error);
