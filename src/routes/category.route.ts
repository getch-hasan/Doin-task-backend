import express from "express";
import {
  createCategory,
  getAllCategory,
} from "../controllers/Category.controller";
import multer from "multer";
// import { Router } from "express";

const router = express.Router();
const upload = multer();
router.post("/", upload.none(), createCategory);
router.get("/", getAllCategory);
export default router;
