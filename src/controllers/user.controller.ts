import bcrypt from "bcrypt";
import { Request, Response } from "express";
// import User from "../models/user.model";
import { generateAccessToken, generateRefreshToken } from "../utils/token.util";
import { User } from "../models/user.model";
import { AuthRequest } from "../middlewares/auth.middleware";

// ✅ Registration with Password Hashing
export const register = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

   

    // Save the user to the database
    const newUser = new User({ name, email, password });
    await newUser.save();

    // Generate tokens
    const accessToken = generateAccessToken(newUser._id.toString());
    const refreshToken = generateRefreshToken(newUser._id.toString());

    // Respond with the new user and tokens
    res.status(201).json({ user: newUser, accessToken, refreshToken });
  } catch (error) {
       console.error("Register error:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

// ✅ Login with Password Verification

export const logIn = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select("+password");
    console.log("hash", user.password);
    console.log("haentered pass", password);
    if (!user) {
      res.status(400).json({ message: "Invalid email" });
      return;
    }

    const isMatch = await user.comparePassword(password);
    console.log(isMatch);
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password" });
      return;
    }

    const accessToken = generateAccessToken(user._id.toString());
    const refreshToken = generateRefreshToken(user._id.toString());

    res.status(200).json({
      message: "Login Successful",
      user,
      accessToken,
      refreshToken,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response
) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user)
    if (!user)
  {
    res.status(404).json({ message: "User not found" });
    return
  } 
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const expires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expires;
    await user.save();

    // TODO: Send OTP via email. For now, just return it
    res.status(200).json({ message: "OTP sent", otp }); // ⚠️ Don't return OTP in production
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

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

    user.password = newPassword; // Raw password, will be hashed by pre-save
    user.resetPasswordOTP = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: "Password reset successful" });
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ Get All Users
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Error fetching users" });
  }
};




// ✅ Get User Profile (by token or param)
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id || req.params.id; // ✅ now TS knows about req.user

    if (!userId) {
       res.status(400).json({ message: "User ID is required" });
       return
    }

    const user = await User.findById(userId).select(
      "-password -resetPasswordOTP -resetPasswordExpires"
    );

    if (!user) {
       res.status(404).json({ message: "User not found" });
       return
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

