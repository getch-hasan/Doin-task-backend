import express from "express";
import { forgotPassword, getUsers, logIn, register, resetPassword } from "../controllers/user.controller"; // <-- Fixed Import
import multer from "multer";
const upload = multer();
const router = express.Router();

router.get("/", getUsers);
router.post("/register", upload.none(), register);
router.post("/login", upload.none(), logIn);
router.post("/forgot-password",upload.none(), forgotPassword);
router.post("/reset-password",upload.none(), resetPassword);


export default router;
