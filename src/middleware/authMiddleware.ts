import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env"; // Replace with the relevant secret key

const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Get token from request (it could be passed via headers, cookies, etc.)
    const token = req.headers["authorization"]?.split(" ")[1]; // For example, Bearer <token>
    if (!token) {
      return res
        .status(403)
        .json({ message: "Unauthorized - No token provided" });
    }

    // Verify JWT token
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "Server error: No JWT_SECRET" });
    }

    const decoded = jwt.verify(token, JWT_SECRET as string);
    if (!decoded) {
      return res.status(403).json({ message: "Unauthorized - Invalid token" });
    }

    // If the JWT contains F1-specific data, extract it here.
    // Example: if the JWT includes a 'teamId' or 'role', extract and attach it to req

    // Continue to the next middleware
    next();
  } catch (error) {
    console.error("AuthMiddleware Error: ", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export default authMiddleware;
