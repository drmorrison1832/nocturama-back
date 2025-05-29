function isValidPassword(req, res, next) {
  // console.log("\n⚠️  isValidPassword...");

  if (typeof req?.body?.password !== "string") {
    return false;
  }

  // Password strength validation
  //   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  //   return (passwordRegex.test(password))

  return true;
}

module.exports = isValidPassword;
