import jwt, { Secret }  from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express"
import { config } from '../config/env';



export interface AuthRequest extends Request{
    user?:any
}
export const authenticationToken=(req:Request,res:Response,next:NextFunction)=>{
    const token = req.header("Authorization")?.split(" ")[1];

    if(!token){
  res.status(401).json({message:"Access Denied"})
  return
    }
    try {
        const verified = jwt.verify(token, config.JWT_SECRETE as string);
        (req as AuthRequest).user=verified
        next()

    } catch (error) {
        res.status(403).json({ message: "Invalid Token" });
        return
    }
}