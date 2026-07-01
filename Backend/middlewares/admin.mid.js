import jwt from "jsonwebtoken";

const adminMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "No token provided",
      });
    }

    if (!authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid token format. Use: Bearer <token>",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_ADMIN_PASSWORD
    );

    req.adminId = decoded.id;

    next();
  } catch (error) {
   

    return res.status(401).json({
      error: "Invalid or expired token",
    });
  }
};

export default adminMiddleware;