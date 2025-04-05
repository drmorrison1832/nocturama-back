const express = require("express");
const router = express.Router();

// const requireAuth = require("../utils/requireAuth");
// router.use(requireAuth); // Ça s'applique à toutes les routes...

const Article = require("../models/article");
const validateEntry = require("../middleware/validateEntry");

router.post("/articles", validateEntry(Article), async (req, res, next) => {
  try {
    // let response = await article.save();
    // console.log("Article saved");
    return res.status(200).json("something");
  } catch (error) {
    next(error);

    // console.error(error.message);
    // return res.status(500).json({ message: error.message });
  }
});

router.get("/articles", async (req, res) => {
  return res.status(200).json("HERE, THE ARTICLES");
});

router.put("/articles", async (req, res) => {
  return res.status(200).json("Something");
});

router.delete("/articles", async (req, res) => {
  return res.status(200).json("Something");
});

module.exports = router;
