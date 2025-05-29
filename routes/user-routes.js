const router = require("express").Router();
const { AppError, ValidationError } = require("../utils/customErrors");
const User = require("../models/user-model");
// const Article = require("../models/article-model");

const {
  validateNewUserInput,
  validateResourceExists,
} = require("../middleware/validators-index");
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
        token: newUser.token,
      },
    });
  } catch (error) {
    // Handle duplicate email
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return next(
        new AppError({
          name: "DuplicateKeyError",
          message: `${field} already registered`,
          type: "DUPLICATE_KEY",
          code: 409,
          details: {
            field,
            value: error.keyValue[field],
          },
        })
      );
    }

    // If there's an error here, it would be a server-side error
    if (error.name === "ValidationError") {
      return next(
        new AppError({
          name: "ValidationError",
          message: "Server-side validation failed",
          type: "VALIDATION_ERROR",
          code: 500,
          details: error.message,
        })
      );
    }

    return next(error);
  }
});

router.post("/login", validateResourceExists(User), async (req, res, next) => {
  try {
    // const userQuery = await User.findOne({ username: req.body.username });

    // if (!userQuery) {
    //   console.log("User not found");
    //   return res.status(401).json({ message: "Wrong user or password" });
    // }
    // console.log("User found");

    // let visitorHash = SHA256(req.body.password + userQuery.salt).toString(
    //   encBase64
    // );

    // if (visitorHash === userQuery.hash) {
    //   console.log("Password is correct");
    //   return res.status(200).json({
    //     message: `Welcome back, ${userQuery.username}`,
    //     username: userQuery.username,
    //     token: userQuery.token,
    //   });
    // } else {
    //   console.log("Wrong password");
    //   return res.status(401).json({ message: "Wrong user or password" });
    // }
    return res.status(200).json({ message: "yo" });
  } catch (error) {
    throw error;
  }
});

router.post("/logout", async (req, res, next) => {
  // console.log(`🔹 Requested route: auth/logout`);

  try {
    return res.status(200).json({ message: "yo" });
  } catch (error) {
    throw error;
  }
});

module.exports = router;
