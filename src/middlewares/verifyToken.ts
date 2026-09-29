import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/config.js";
import type {JwtPayload} from "../types/AuthPayload.js";

export function verifyToken(req: Request, res: Response, next: NextFunction){
    const token = req.headers.authorization?.split(" ")[1];
    if(!token){
        return res.status(401).json({
            message: "User not authenticated"
        });
    }
    
    try{
        const decoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload;
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid token sent"
        })
    }
}