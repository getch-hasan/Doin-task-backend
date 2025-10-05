import jwt, { Secret } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { config } from "../config/env";

export interface AuthRequest extends Request {
  user?: { userId: string; role?: string };
}

export const authenticationToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRETE as Secret) as {
      userId: string;
      role?: string;
    };

    (req as AuthRequest).user = {
      userId: decoded.userId, // ✅ keep the same naming
      role: decoded.role || "user",
    };

    next();
  } catch (error) {
    console.error("Token verification failed:", error);
    res.status(403).json({ message: "Invalid Token" });
    return;
  }
};
