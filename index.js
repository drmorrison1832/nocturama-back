require("dotenv").config();
const PORT = process.env.PORT || 3000;

const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const parseJSON = require("./utils/parseJSON");
const showReq = require("./middleware/showReq");
const articleRoutes = require("./routes/article-routes");
const userRoutes = require("./routes/user-routes");
const handleError = require("./middleware/handleError");
const mongoose = require("mongoose");

const corsOptions = {
  origin: process.env.CLIENT_URL || `http://localhost:${process.env.PORT}`,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

const app = express();

app.use(helmet());
app.use(xss());
app.use(cors(corsOptions));
app.use(express.json({ limit: "10mb", verify: parseJSON }));
app.use(express.urlencoded({ extended: true }));
app.use(showReq);

app.use("/api/articles", articleRoutes);
app.use("/api/auth", userRoutes);

app.use(handleError);

app.all("/{*splat}", (req, res) => {
  return res.status(404).json({ status: "error", message: "Route not found" });
});

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
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});
