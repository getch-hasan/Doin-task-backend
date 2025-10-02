
import express from "express";
import { authenticationToken } from "../middlewares/auth.middleware";


const router = express.Router();

router.get("/profile", authenticationToken, (req, res) => {
  res.json({ message: "This is a protected route"});
});

export default router;
