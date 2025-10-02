

import  jwt, { Secret, SignOptions }  from 'jsonwebtoken';
import { config } from '../config/env';
export const generateAccessToken=(userId:string)=>{
    return jwt.sign({userId},config.JWT_SECRETE as Secret,{expiresIn:config.JWT_EXPIRES_IN as string} as SignOptions);
};
export const generateRefreshToken=(userId:string)=>{
return jwt.sign({userId},config.JWT_REFRESH_SECRETE as Secret,{expiresIn:config.JWT_REFRESH_EXPIRES_IN as string} as SignOptions );
};
export const verifyAccessToken=(token:string)=>jwt.verify(token,config.JWT_SECRETE as Secret);
export const verifyRefreshToken=(token:string)=>jwt.verify(token,config.JWT_REFRESH_SECRETE as Secret)