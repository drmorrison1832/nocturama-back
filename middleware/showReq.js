function showReq(req, res, then) {
  console.log("\n⚠️  ShowReq", req.method + ":", req.url);

  req.headers.authorization &&
    console.log(
      "  headers.authorization (token):",
      req.headers.authorization.replace("Bearer ", "")
    );

  Object.keys(req?.params)?.length && console.log("  Params:", req.params);
  Object.keys(req?.query)?.length && console.log("  Query:", req.query);
  Object.keys(req?.body)?.length && console.log("  Body:", req.body);
  req.files && console.log("  Files:", req.files);

  then();
}

module.exports = showReq;
