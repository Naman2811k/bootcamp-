const loggerMiddleware = (req, res, next) => {
  const start     = Date.now();
  const timestamp = new Date().toISOString();

  res.on("finish", () => {
    const duration = Date.now() - start;

    const statusColor =
      res.statusCode >= 500 ? "\x1b[31m"
      : res.statusCode >= 400 ? "\x1b[33m"
      : res.statusCode >= 200 ? "\x1b[32m"
      : "\x1b[0m";

    const methodColor =
      req.method === "GET"    ? "\x1b[36m"
      : req.method === "POST"   ? "\x1b[32m"
      : req.method === "PUT"    ? "\x1b[33m"
      : req.method === "DELETE" ? "\x1b[31m"
      : "\x1b[0m";

    console.log(
      `\x1b[90m[${timestamp}]\x1b[0m ` +
      `${methodColor}${req.method.padEnd(7)}\x1b[0m ` +
      `\x1b[37m${req.originalUrl.padEnd(30)}\x1b[0m ` +
      `${statusColor}${res.statusCode}\x1b[0m ` +
      `\x1b[90m${duration}ms\x1b[0m`
    );
  });

  next();
};

module.exports = loggerMiddleware;
