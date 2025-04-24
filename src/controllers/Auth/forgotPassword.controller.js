import { Otp } from "../../models/optModal.js";
import { User } from "../../models/userModal.js";
import { sendMailOtp } from "../../services/email.service.js";
import { generateOtp, hashPassword } from "../../utils/bcrypt.util.js";
import bcrypt from "bcryptjs";

export async function verifyEmail(req, res) {
  const { email } = req.body;

  try {
    if (!email) {
      return res.status(400).json({
        message: "Please provide email.",
        success: false,
      });
    }

    // Find user by email
    const user = await User.findOne({ email }).select("userName password ");

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // Generate OTP
    const otpCode = generateOtp();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // expires after 1 hour

    // Save OTP to database
    const existingOtp = await Otp.findOne({ email });
    if (existingOtp) {
      await Otp.deleteOne({ email });
    }

    const { userName, password,  } = user;

    const otp = new Otp({
      email,
      otpCode,
      isUsed: false,
      userName,
      password,
    });

    await otp.save();

    // Send OTP via Email
    const emailResponse = await sendMailOtp(email, otpCode);

    if (!emailResponse.success) {
      return res.status(500).json({
        message: "Failed to send OTP email for verification.",
        success: false,
      });
    }

    // Send OTP via SMS
    // const smsResponse = await sendOtpSMS(phoneNumber, otpCode);

    // if (!smsResponse.success) {
    //   return res.status(500).json({
    //     message: "Failed to send OTP via SMS.",
    //     success: false,
    //   });
    // }

    return res.status(200).json({
      message: "OTP sent to your email",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      issue: error.message,
    });
  }
}
export async function verifyOTPCode(req, res) {
  const { email, otp } = req.body;
  try {
    if (!email || !otp)
      return res.status(400).json({
        message: "Email or Code is required.",
        success: false,
      });

    const user = await Otp.findOne({ email });
    if (!user)
      res.status(400).json({
        message: "Otp not found.",
        success: false,
      });

    if (user.otpCode !== otp) {
      res.status(400).json({
        message: "Invalid Otp.",
        success: false,
      });
    }
    await Otp.deleteOne({ email: email, otpCode: otp });
    return res.status(200).json({
      message: "Otp Verified Successfully.",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      issue: error.message,
    });
  }
}

export async function forgetPassword(req, res) {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({
        message: "Email or Password is required.",
        success: false,
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found.",
        success: false,
      });
    }

    // Compare new password with the old password
    const isSamePassword = bcrypt.compareSync(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "You are using an old password. Please use a new password.",
        success: false,
      });
    }

    // Update user's password
    user.password = hashPassword(password); // Implement `hashPassword` logic securely
    await user.save();

    return res.status(200).json({
      message: "Password reset successfully.",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      issue: error.message,
    });
  }
}
