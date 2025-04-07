const dotenv = require("dotenv");
dotenv.config();

// DB connection
const mongoose = require("mongoose");
(function connectToDB() {
  try {
    // mongoose.connect(process.env.MONGODB_URI); // remote
    mongoose.connect("mongodb://localhost:27017/nocturama"); // local

    console.log("☎️  Connection to database sucessfull");
  } catch (error) {
    console.error("❌ Connection to database failed:", error);
  }
})();

// Imports
// Modules
const express = require("express");
// Middleware
const cors = require("cors");
const showReq = require("./middleware/showReq");
const articleRoutes = require("./routes/article-routes");
const handleError = require("./middleware/handleError");

const corsOptions = {
  // origin: process.env.ADMIN_FRONTEND_URL || "http://localhost:5173",
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"],
  // // credentials: true, // If you're using cookies/sessions
  // // maxAge: 600, // Cache preflight requests for 10 minutes
  // optionsSuccessStatus: 200,
};

// Create server
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(showReq);
app.use("/admin", articleRoutes);
app.use(handleError);

app.all("/{*splat}", (req, res) => {
  console.error("⚠️ Unknown route");
  return res.status(401).json("Nothing to see here...");
});

app.listen(process.env.PORT || 3200, () => {
  console.info("🚀 Serveur started on port", process.env.PORT || 3200);
});
