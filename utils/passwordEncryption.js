const crypto = require("crypto");

function createSaltAndHash(password) {
  const salt = crypto.randomBytes(64).toString("base64");
  const hash = crypto
    .pbkdf2Sync(password, salt, 100000, 64, "sha512")
    .toString("base64");
  return { hash, salt };
}

function verifyPassword(storedHash, salt, providedPassword) {
  const storedHashBuffer = Buffer.from(storedHash, "base64");
  const providedPasswordHashBuffer = crypto.pbkdf2Sync(
    providedPassword,
    salt,
    100000,
    64,
    "sha512"
  );

  return crypto.timingSafeEqual(storedHashBuffer, providedPasswordHashBuffer);
}

module.exports = { createSaltAndHash, verifyPassword };
