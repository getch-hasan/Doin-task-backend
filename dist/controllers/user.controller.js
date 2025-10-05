"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfile = exports.getUsers = exports.resetPassword = exports.forgotPassword = exports.logIn = exports.register = void 0;
const token_util_1 = require("../utils/token.util");
const user_model_1 = require("../models/user.model");
// ✅ Register a new user
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // check if user already exists
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: "User already exists" });
            return;
        }
        // create and save new user
        const newUser = new user_model_1.User({ name, email, password });
        await newUser.save();
        // generate JWT tokens
        const accessToken = (0, token_util_1.generateAccessToken)({
            userId: String(newUser._id),
            role: newUser.role,
        });
        const refreshToken = (0, token_util_1.generateRefreshToken)({
            userId: String(newUser._id),
            role: newUser.role,
        });
        res.status(201).json({
            message: "Registration successful",
            user: newUser,
            accessToken,
            refreshToken,
        });
    }
    catch (error) {
        console.error("Register error:", error);
        res.status(500).json({ error: "Error creating user" });
    }
};
exports.register = register;
// ✅ Login user
const logIn = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await user_model_1.User.findOne({ email }).select("+password");
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
        const accessToken = (0, token_util_1.generateAccessToken)({
            userId: String(user._id),
            role: user.role,
        });
        const refreshToken = (0, token_util_1.generateRefreshToken)({
            userId: String(user._id),
            role: user.role,
        });
        res.status(200).json({
            message: "Login successful",
            user,
            accessToken,
            refreshToken,
        });
    }
    catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
exports.logIn = logIn;
// ✅ Forgot password
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await user_model_1.User.findOne({ email });
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
    }
    catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.forgotPassword = forgotPassword;
// ✅ Reset password
const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;
    try {
        const user = await user_model_1.User.findOne({ email }).select("+password");
        if (!user ||
            user.resetPasswordOTP !== otp ||
            !user.resetPasswordExpires ||
            user.resetPasswordExpires < new Date()) {
            res.status(400).json({ message: "Invalid or expired OTP" });
            return;
        }
        user.password = newPassword;
        user.resetPasswordOTP = undefined;
        user.resetPasswordExpires = undefined;
        await user.save();
        res.status(200).json({ message: "Password reset successful" });
    }
    catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.resetPassword = resetPassword;
// ✅ Get all users (admin only)
const getUsers = async (req, res) => {
    try {
        const users = await user_model_1.User.find();
        res.status(200).json(users);
    }
    catch (error) {
        res.status(500).json({ error: "Error fetching users" });
    }
};
exports.getUsers = getUsers;
// ✅ Get logged-in user profile
const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(400).json({ message: "User ID is required" });
            return;
        }
        const user = await user_model_1.User.findById(userId).select("-password -resetPasswordOTP -resetPasswordExpires");
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error("Get profile error:", error);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getProfile = getProfile;
