const express = require("express");
const router = express.Router();

const { v4: uuidv4 } = require("uuid");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

const User = require("../models/User");

router.post("/user/signup", async (req, res) => {
  console.log(`🔹 Requested route: user/signup`);
  try {
    const userQuery = await User.findOne({ username: req.body.username });
    if (userQuery) {
      return res.status(400).json({ message: "Username already registered" });
    }

    let newUser = new User();
    const newSalt = uuidv4();
    newUser.username = req.body.username;

    newUser.salt = newSalt;
    newUser.hash = SHA256(req.body.password + newSalt).toString(encBase64);
    newUser.token = uuidv4();

    const response = await newUser.save();

    return res.status(201).json({
      message: `Welcome, ${response.username}`,
      username: response.username,
      token: response.token,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/user/login", async (req, res) => {
  console.log(`🔹 Requested route: user/login`);

  try {
    const userQuery = await User.findOne({ username: req.body.username });

    if (!userQuery) {
      console.log("User not found");
      return res.status(401).json({ message: "Wrong user or password" });
    }
    console.log("User found");

    let visitorHash = SHA256(req.body.password + userQuery.salt).toString(
      encBase64
    );

    if (visitorHash === userQuery.hash) {
      console.log("Password is correct");
      return res.status(200).json({
        message: `Welcome back, ${userQuery.username}`,
        username: userQuery.username,
        token: userQuery.token,
      });
    } else {
      console.log("Wrong password");
      return res.status(401).json({ message: "Wrong user or password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

module.exports = router;
