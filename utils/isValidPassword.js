function isValidPassword(password) {
  // console.log("\n⚠️  isValidPassword...");

  if (typeof password !== "string") {
    return false;
  }

  // Password strength validation
  //   const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,}$/;
  //   return (passwordRegex.test(password))

  return true;
}

module.exports = isValidPassword;
