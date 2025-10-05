import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { config } from "../config/env";

interface TokenPayload {
  userId: string;  
  role?: string;   
}

export const generateAccessToken = (payload: TokenPayload) => {
  return jwt.sign(
    payload, 
    config.JWT_SECRETE as Secret,
    { expiresIn: config.JWT_EXPIRES_IN as string } as SignOptions
  );
};

export const generateRefreshToken = (payload: TokenPayload) => {
  return jwt.sign(
    payload,
    config.JWT_REFRESH_SECRETE as Secret,
    { expiresIn: config.JWT_REFRESH_EXPIRES_IN as string } as SignOptions
  );
};

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, config.JWT_SECRETE as Secret);

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, config.JWT_REFRESH_SECRETE as Secret);
