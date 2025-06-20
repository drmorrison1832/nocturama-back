function showReq(req, res, then) {
  console.log("☎️  ", req.method, req.url);

  // console.log("\n⚠️  ShowReq...");
  // console.log("Route is:", req.method + ":", req.url);
  // console.log("req is:");

  console.log("rawHeaders:", req.rawHeaders);
  // req?.headers?.authorization &&
  //   console.log(
  //     "  headers.authorization (token):",
  //     req.headers.authorization.replace("Bearer ", "")
  //   );

  // req?.headers?.params && console.log("  params:", req?.params);
  // req?.query && console.log("  query:", req?.query);
  // req?.body && console.log("  body:", req?.body);
  // req?.files && console.log("  files:", req?.files);
  // console.log("\n");
  then();
}

module.exports = showReq;
