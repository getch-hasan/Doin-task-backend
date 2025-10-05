import bcrypt from "bcrypt";
import { Request, Response } from "express";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// ✅ Register a new user
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    // create and save new user
    const newUser = new User({ name, email, password });
    await newUser.save();

    // generate JWT tokens
    const accessToken = generateAccessToken({
      userId: String(newUser._id),
      role: newUser.role,
    });

    const refreshToken = generateRefreshToken({
      userId: String(newUser._id),
      role: newUser.role,
    });

    res.status(201).json({
      message: "Registration successful",
      user: newUser,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

// ✅ Login user
export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      res.status(400).json({ message: "Invalid email" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    // ✅ FIX: use `user`, not `newUser`
    const accessToken = generateAccessToken({
      userId: String(user._id),
      role: user.role,
    });

    const refreshToken = generateRefreshToken({
      userId: String(user._id),
      role: user.role,
    });

    res.status(200).json({
      message: "Login successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ✅ Forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expires;
    await user.save();

    res.status(200).json({ message: "OTP sent", otp }); // ⚠️ Only for testing
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Reset password
export const resetPassword = async (req: Request, res: Response) => {
  const { email, otp, newPassword } = req.body;

  try {
    const user = await User.findOne({ email }).select("+password");

    if (
      !user ||
      user.resetPasswordOTP !== otp ||
      !user.resetPasswordExpires ||
      user.resetPasswordExpires < new Date()
    ) {
      res.status(400).json({ message: "Invalid or expired OTP" });
      return;
    }

    user.password = newPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get all users (admin only)
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};

// ✅ Get logged-in user profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    

    if (!userId) {
      res.status(400).json({ message: "User ID is required" });
      return;
    }

    const user = await User.findById(userId).select(
      "-password -resetPasswordOTP -resetPasswordExpires"
    );

    if (!user) {
      res.status(404).json({ message: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
