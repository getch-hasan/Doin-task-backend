import  multer  from 'multer';
import express from "express";
import { createTask, deleteTask, getTaskById, getTasks, searchTask, updateTask,  } from "../controllers/task.controller";
import { uploadTaskImage } from '../middlewares/upload';
import { authenticationToken } from '../middlewares/auth.middleware';

const router = express.Router();
const upload = multer();
router.post("/",uploadTaskImage, createTask);
router.get("/",authenticationToken, getTasks);
router.delete("/:id", deleteTask); 
router.put("/:id",upload.none(), updateTask); 
router.get("/:id", getTaskById);
router.post("/search",upload.none(), searchTask);

export default router;
 