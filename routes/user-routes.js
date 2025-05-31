const router = require("express").Router();

const { AppError, ValidationError } = require("../utils/customErrors");

const User = require("../models/user-model");
// const Article = require("../models/article-model");

const {
  validateToken,
  validateLoginInput,
  validateNewUserInput,
  validateUserEmailExists,
} = require("../middleware/middlewareValidators-index");

const validatePassword = require("../utils/validatePassword");

const sanitizeEmail = require("../utils/sanitizeEmail");
const { randomUUID } = require("crypto"); // instead of const { v4: uuidv4 } = require("uuid");
const SHA256 = require("crypto-js/sha256");
const encBase64 = require("crypto-js/enc-base64");

router.post("/signup", validateNewUserInput, async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Generate authentication credentials
    const salt = randomUUID();
    const hash = SHA256(password + salt).toString(encBase64);
    const token = randomUUID();

    const newUser = new User({
      email: sanitizeEmail(email),
      salt,
      hash,
      token,
    });
    await newUser.save();

    return res.status(201).json({
      status: "success",
      message: "User created successfully",
      data: {
        email: newUser.email,
        id: newUser._id,
        token: newUser.token,
        articles: newUser.articles,
      },
    });
  } catch (error) {
    // Handle duplicate email
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(
        new AppError({
          name: "DuplicateKeyError",
          message: `User already registered`,
          type: "DUPLICATE_KEY",
          code: 409,
        })
      );
    }

    return next(error);
  }
});

router.post(
  "/login",
  validateLoginInput,
  validateUserEmailExists,
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email }).select("+hash +salt");

      const { hash, salt } = user;

      validatePassword(hash, salt, password);

      const newToken = randomUUID();

      user.token = newToken;

      await user.save();

      return res.status(200).json({
        status: "succes",
        message: "Login successful",
        data: {
          email: user.email,
          id: user._id,
          token: newToken,
          articles: user.articles,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.post("/logout", validateToken, async (req, res, next) => {
  try {
    const user = await User.findById(req.userID);

    user.token = null;
    user.save();

    return res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
