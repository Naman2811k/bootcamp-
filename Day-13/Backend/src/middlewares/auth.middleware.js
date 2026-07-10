import jwt from "jsonwebtoken";

/**
 * @route Middleware
 * @description Checks whether user is Authorized or not
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
export async function authMiddleware(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized User",
    });
  }

  try {
    const verified = await jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    return next();
  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Unauthorized User",
    });
  }
}
