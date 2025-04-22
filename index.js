const dotenv = require("dotenv");
dotenv.config();

// DB connection
const mongoose = require("mongoose");
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
const express = require("express");
const cors = require("cors");
const showReq = require("./middleware/showReq");
const articleRoutes = require("./routes/article-routes");
const handleError = require("./middleware/handleError");

const corsOptions = {
  // Nothing for the moment
};

// Create server
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
// app.use(showReq);
app.use("/admin", articleRoutes);
app.use(handleError);

app.all("/{*splat}", (req, res) => {
  console.error("⚠️ Unknown route");
  return res.status(401).json("Nothing to see here...");
});

app.listen(process.env.PORT || 3200, () => {
  console.info("🚀 Serveur started on port", process.env.PORT || 3200);
});
