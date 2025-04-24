import Joi from "joi";
import mongoose, { Schema } from "mongoose";

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "user",
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

export async function validateSignup(body) {
  const signupSchema = Joi.object({
    userName: Joi.string().trim().required().messages({
      "string.empty": "User name is required",
    }),
    email: Joi.string().email().required().messages({
      "string.email": "Must be a valid email",
      "string.empty": "Email is required",
    }),

    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
    }),
  });

  return signupSchema.validateAsync(body, { abortEarly: false });
}

export async function validateSignin(body) {
  const signupSchema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Must be a valid email",
      "string.empty": "Email is required",
    }),

    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters",
      "string.empty": "Password is required",
    }),
  });
  return signupSchema.validateAsync(body, { abortEarly: false });
}
