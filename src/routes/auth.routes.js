import { signIn, updateProfile } from "../controllers/Auth/signin.controller.js";
import { createUser, signUp } from "../controllers/Auth/signup.controller.js";
import express from "express";
import {
  forgetPassword,
  verifyEmail,
  verifyOTPCode,
} from "../controllers/Auth/forgotPassword.controller.js";

const AuthRouter = express.Router();

AuthRouter.use(express.json());

AuthRouter.post("/signup", signUp);
AuthRouter.post("/verify-code", createUser);
AuthRouter.post("/signin", signIn);
AuthRouter.post("/verify-email", verifyEmail);
AuthRouter.post("/verify-otp", verifyOTPCode);
AuthRouter.post("/forgot-password", forgetPassword);
AuthRouter.post("/updateProfile", updateProfile);

export default AuthRouter;

// // http://localhost:5000/api/auth/user/signin
// {
//   "email":"testuser2@gmail.com",
//   "password":"123456789"
// }