const router = require("express").Router();

const { AppError } = require("../utils/customErrors");

const User = require("../models/user-model");
// const Article = require("../models/article-model");

const {
  validateLoginInput,
  validateNewUserInput,
  validateToken,
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

    const salt = randomUUID();
    const hash = SHA256(password + salt).toString(encBase64);
    const token = randomUUID();

    const newUser = await User.create({
      email: sanitizeEmail(email),
      salt,
      hash,
      token,
    });

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
    if (error.code === 11000) {
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

      // Thorws UnauthorizedError if wrong password
      validatePassword(user.hash, user.salt, password);

      const newToken = randomUUID();
      user.token = newToken;
      await user.save();

      return res.status(200).json({
        status: "success",
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
    const user = User.findByIdAndUpdate(req.user._id, { token: "" });

    if (!user) {
      return next(
        new AppError({
          name: "NotFoundError",
          message: `User not found`,
          type: "NotFoundError",
          code: 404,
        })
      );
    }

    return res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
});

module.exports = router;
