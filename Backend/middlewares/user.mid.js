import jwt from "jsonwebtoken";
import config from "../config.js";

function userMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

   

    const token = authHeader?.split(" ")[1];

    

    const decoded = jwt.verify(token, config.JWT_USER_PASSWORD);

    

    req.userId = decoded.id;

    next();
  } catch (error) {
    console.log("JWT Error Name:", error.name);
    console.log("JWT Error Message:", error.message);

    return res.status(401).json({
      errors: error.message,
    });
  }
}

export default userMiddleware;