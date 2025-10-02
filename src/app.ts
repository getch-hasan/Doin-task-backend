import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/task.routes";
import multer from "multer";
import protectedRoutes from "./routes/protectet.route";
import categoryRoutes from "./routes/category.route";


dotenv.config();


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Use User Routes
app.use("/api/users", userRoutes);
app.use("/api/protected", protectedRoutes);
app.use("/api/task", productRoutes);
app.use("/api/category", categoryRoutes);
export default app;
