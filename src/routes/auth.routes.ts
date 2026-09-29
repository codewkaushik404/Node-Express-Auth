import { Router } from "express";
import { userSignUp, getUser, refreshToken, logout, logoutAll, userSignIn, verifyOtp } from "../controllers/auth.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";

const router = Router();

//For registering users 
router.post("/signup", userSignUp);

//For login 
router.post("/signin", userSignIn);

//verifying otp
router.post("/verify-otp", verifyOtp);

//For getting user information
router.get("/user", verifyToken, getUser);

//for generating a new temporary access token and set new refresh token in cookie
router.get("/refresh", refreshToken);

//logout user from current device
router.get("/logout", logout);

//logout current user from all the diff devices that he is currently logged in 
router.get("/logout-all", logoutAll);


export default router;