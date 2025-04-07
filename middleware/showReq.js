function showReq(req, res, then) {
  console.log("\n⚠️  ShowReq...");
  console.log("Route is:", req.method + ":", req.url);
  console.log("req is:");

  req.headers.authorization &&
    console.log(
      "  headers.authorization (token):",
      req.headers.authorization.replace("Bearer ", "")
    );

  console.log("  Params:", req?.params);
  console.log("  Query:", req?.query);
  console.log("  Body:", req?.body);
  console.log("  Files:", req?.files);
  console.log("\n");
  then();
}

module.exports = showReq;
