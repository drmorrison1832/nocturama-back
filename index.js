require("dotenv").config();
const env = process.env.NODE_ENV;
const local = process.env.NODE_LOCAL === "true" ? true : false;

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const parseJSON = require("./utils/parseJSON");
const showReq = require("./middleware/showReq");
const articleRoutes = require("./routes/article-routes");
const userRoutes = require("./routes/user-routes");
const handleError = require("./middleware/handleError");

const app = express();

(function connectToDB() {
  try {
    // mongoose.connect(process.env.MONGODB_URI); // Remote
    mongoose.connect("mongodb://localhost:27017/nocturama"); // Local

    console.log("☎️  Connection to database sucessfull");
  } catch (error) {
    console.error("❌ Connection to database failed:", error);
  }
})();

// Modules & middleware

const corsOptions = {
  // origin: process.env.CLIENT_URL || `http://localhost:${process.env.PORT}`,
  // credentials: true,
  // methods: ["GET", "POST", "PUT", "DELETE"],
  // allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json({ verify: parseJSON }));
app.use(showReq);
app.use("/admin/article", articleRoutes);
app.use("/admin/auth", userRoutes);
app.use(handleError);

app.all("/{*splat}", (req, res) => {
  console.error("⚠️ Unknown route");
  return res.status(401).json("Nothing to see here...");
});

app.listen(process.env.PORT, () => {
  console.info("🚀 Serveur started on port", process.env.PORT);
});
