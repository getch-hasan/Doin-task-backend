"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticationToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const authenticationToken = (req, res, next) => {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
        res.status(401).json({ message: "Access Denied" });
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.config.JWT_SECRETE);
        req.user = {
            userId: decoded.userId, // ✅ keep the same naming
            role: decoded.role || "user",
        };
        next();
    }
    catch (error) {
        console.error("Token verification failed:", error);
        res.status(403).json({ message: "Invalid Token" });
        return;
    }
};
exports.authenticationToken = authenticationToken;
