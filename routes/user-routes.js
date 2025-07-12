// TO DO:
// - switch to JWT

const router = require("express").Router();

// Import custom errors class
const { AppError } = require("../utils/customErrors");

// Import and set up time express-rate-limit
const rateLimit = require("express-rate-limit");
const limiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  handler: (req, res, next, options) =>
    next(
      new AppError({
        message: "Too many tries.",
        code: 429,
        type: "TOO_MANY_REQUEST",
        name: "TooManyRequests",
      })
    ),
});

// Import models
const User = require("../models/user-model");

// Import custom middleware
const {
  validateLoginInput,
  validateNewUserInput,
  validateChangePasswordInput,
  validatePasswordIsCorrect,
  validateToken,
  validateUserIsActive,
} = require("../middleware/middlewareValidators-index");
const requireRole = require("../middleware/requireRole");

// Import utils
const sanitizeEmail = require("../utils/sanitizeEmail");
const { createSaltAndHash } = require("../utils/passwordEncryption");

// const crypto = require("crypto");
const { randomUUID } = require("crypto"); // instead of const { v4: uuidv4 } = require("uuid");

// const SHA256 = require("crypto-js/sha256");
// const encBase64 = require("crypto-js/enc-base64");

// Setup route
router.use(limiter);

// Routes
router.post(
  "/register",
  validateNewUserInput,
  validateToken,
  requireRole("admin"),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { hash, salt } = createSaltAndHash(password);
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
  }
);

router.post(
  "/login",
  validateLoginInput,
  validatePasswordIsCorrect,
  validateUserIsActive,
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const user = await User.findOne({ email }).select("+hash +salt");

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
    const user = req.user;
    user.token = null;
    user.tokenExpiresAt = null;
    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
});

router.post(
  "/disable",
  validateToken,
  requireRole("admin"),
  validateUserIsActive,
  async (req, res, next) => {
    try {
      const user = req.user;
      user.token = null;
      user.tokenExpiresAt = null;
      user.active = false;
      await user.save();

      return res.status(200).json({
        status: "success",
        message: "User account has been disconnected and disabled",
      });
    } catch (error) {
      return next(error);
    }
  }
);

router.put(
  "/changepassword",
  validateToken,
  validateChangePasswordInput,
  validatePasswordIsCorrect,
  validateUserIsActive,
  async (req, res, next) => {
    try {
      const userID = req.user._id;
      const user = await User.findById(userID).select("+hash +salt");

      const { newPassword } = req.body;
      const { hash, salt } = createSaltAndHash(newPassword);
      const token = randomUUID();

      user.hash = hash;
      user.salt = salt;
      user.token = token;

      await user.save();

      return res.status(200).json({
        status: "success",
        message: "User updated successfully",
        details: "Token has been updated",
        data: {
          token: user.token,
        },
      });
    } catch (error) {
      return next(error);
    }
  }
);

module.exports = router;
