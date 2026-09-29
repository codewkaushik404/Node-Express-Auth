import userModel from "../models/user.schema.js";
import type { Request, Response } from "express";
import type { User } from "../models/user.schema.js";
import bcrypt from "bcrypt";
import config from "../config/config.js";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "../types/AuthPayload.js";
import sessionModel from "../models/session.schema.js";
import otpModel from "../models/otp.schema.js";
import crypto from "crypto";
import { generateOtp, generateHtml } from "../utils/otp.js";

const SALT = 10;

export async function userSignUp(req: Request, res: Response){
    const {username, email, password } = req.body;

    const existingUser: User | null = await userModel.findOne({
        $or: [
            {email}, 
            {username}
        ]
    });

    if(existingUser){
        throw new Error("Credentials are already registered");
    }
    
    const hashedPassword = await bcrypt.hash(password, SALT);

    const user = await userModel.create({
        username, email, password: hashedPassword
    });
    
    const otp = generateOtp();
    const html = generateHtml(otp);

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    
    //use nodemailer to send email with html 

    await otpModel.create({
        email,
        otpHash
    });

    return res.status(201).json({
        message : "User created successfully",
        user : {username: user.username, email: user.email},
    });
}

export async function userSignIn(req: Request, res: Response){
    const {email, password} = req.body;

    const user = await userModel.findOne({
        email
    });

    if(!user){
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    if(!user.verified){
        return res.status(401).json({
            message: "User not verified"
        })
    }

    const isValid = await bcrypt.compare(password, user.password);
    if(!isValid){
        return res.status(401).json({
            message: "Invalid email or password"
        })
    }

    const accessToken = jwt.sign(
        { id: user._id }, 
        config.JWT_SECRET, 
        { expiresIn: "15m" }
    );

    const session = new sessionModel({userId: user._id});

    const refreshToken = jwt.sign(
        { 
            id: user._id,
            sessionId: session._id,
        }, 
        config.JWT_SECRET, 
        { expiresIn: "5d" }
    );

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

    session.refreshTokenHash = refreshTokenHash;
    session.ip = req.ip!;
    session.userAgent = req.headers["user-agent"]!;

    await session.save();

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 5*24*60*60*1000 //in ms
    });

    return res.json({
        message: "User signed in successfully",
        user : {username: user.username, email: user.email},
        accessToken
    })
}

export async function getUser(req: Request, res: Response){
    const {id} = req.user!;

    const user = await userModel.findById(id);
    if(!user){
        return res.status(401).json({
            message: "User not authenticated"
        });        
    }

    return res.json({
        message: "User fetched successfully",
        user: {username: user.username, email: user.email}
    })
}

export async function refreshToken(req: Request, res: Response){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(401).json({
            message: "Refresh Token not found"
        })
    }
    
    try{
        const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");

        const session = await sessionModel.findOne({
            refreshTokenHash,
            revoked: false
        });

        if(!session){
            return res.status(401).json({
                message: "Invalid Refresh Token sent"
            })
        }

        const accessToken = jwt.sign(
            { id: session.userId }, 
            config.JWT_SECRET, 
            { expiresIn: "15m" }
        );

        const newRefreshToken = jwt.sign(
            { 
                id: session.userId,
                sessionId: session._id 
            }, 
            config.JWT_SECRET, 
            { expiresIn: "5d" }
        );

        const newRefreshTokenHash = crypto.createHash("sha256").update(newRefreshToken).digest("hex");
        session.refreshTokenHash = newRefreshTokenHash;

        await session.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            sameSite: "lax",
            maxAge: 5*24*60*60*1000 //in ms
        });

        return res.json({
            message : "Access Token generated successfully",
            accessToken
        });
    }
    catch(err){
        return res.status(401).json({
            message: "Invalid Refresh Token sent"
        })
    }
}

export async function logout(req: Request, res: Response){
    //set session revoked: true and clear the refresh token cookie
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh Token not found"
        })
    }

    const refreshTokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex");
    const session = await sessionModel.findOne({
        refreshTokenHash,
        revoked: false
    })

    if(!session){
        return res.status(401).json({
            message: "Invalid Refresh Token sent"
        });
    }

    session.revoked = true;
    await session.save();

    res.clearCookie("refreshToken");
    return res.json({
        message: "Logged out successfully"
    });
}

export async function logoutAll(req: Request, res: Response){
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken){
        return res.status(400).json({
            message: "Refresh Token not found"
        });
    }

    const decoded = jwt.verify(refreshToken, config.JWT_SECRET) as JwtPayload;

    await sessionModel.updateMany({
        userId: decoded.id,
        revoked: false
    }, { revoked: true });

    res.clearCookie("refreshToken");

    return res.json({
        message: "Logged out of all devices successfully"
    });
}

export async function verifyOtp(req: Request, res: Response){
    const {email, otp} = req.body;

    if(!email || !otp){
        return res.status(400).json({
            message: "Invalid payload"
        });
    }

    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const otpObj = otpModel.findOne({
        email, 
        otpHash
    });

    if(!otpObj){
        return res.status(401).json({
            message: "Invalid details"
        });
    }

    const user = await userModel.findOne({ email });

    if(!user){
        return res.status(401).json({
            message: "Invalid details"
        });
    }

    user.verified = true;
    await user.save();

    return res.json({
        message: "User verified successfully"
    });
}
