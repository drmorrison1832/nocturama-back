const dotenv = require("dotenv");
dotenv.config();

const mongoose = require("mongoose");

(function connectToDB() {
  try {
    // mongoose.connect(process.env.MONGODB_URI);
    mongoose.connect("mongodb://localhost:27017/");

    console.log("☎️  Connection to database sucessfull");
  } catch (error) {
    console.error("❌ Connection to database failed:", error);
  }
})();

const cors = require("cors");

const express = require("express");
const showReq = require("./middleware/showReq");
const handleError = require("./middleware/handleError");

const app = express();
app.use(cors());
app.use(express.json());
app.use(showReq);
app.use(handleError);

const articleRoutes = require("./routes/article-routes");
app.use(articleRoutes);

app.all("/{*splat}", (req, res) => {
  console.error("⚠️ Unknown route");
  return res.status(401).json("Nothing to see here...");
});

app.listen(process.env.PORT || 3200, () => {
  console.info("🚀 Serveur started on port", process.env.PORT || 3200);
});
