import Joi from "joi";
import mongoose, { Schema } from "mongoose";

const otpSchema = new Schema(
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
    otpCode: {
      type: String,
      required: [true, "OTP code is required."],
      minlength: [6, "OTP must be at least 6 characters."],
      maxlength: [6, "OTP must be exactly 6 characters."],
    },
  },
  { timestamps: true }
);

export const Otp = mongoose.model("Otp", otpSchema);

export function validateOtpVerification(body) {
  const otpSchema = Joi.object().keys({
    email: Joi.string().email().required().label("email").messages({
      "any.required": "Email is required",
      "string.empty": "Email cannot be empty",
      "string.email": "Invalid email format",
    }),
    otpCode: Joi.string().length(6).required().label("otpCode").messages({
      "any.required": "OTP code is required",
      "string.empty": "OTP code cannot be empty",
      "string.length": "OTP code must be exactly 6 characters",
    }),
  });

  return otpSchema.validate(body);
}
