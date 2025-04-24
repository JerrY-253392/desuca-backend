import { Otp, validateOtpVerification } from "../../models/optModal.js";
import { User, validateSignup } from "../../models/userModal.js";
import { sendMailOtp, sendSignupEmail } from "../../services/email.service.js";
import { generateOtp, hashPassword } from "../../utils/bcrypt.util.js";

export async function signUp(req, res) {
  console.log("reqbody" , req.body)
  let { userName, email, password } = req.body;

  const { error } = validateSignup({ userName, email, password });
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
    });
  }

  try {
    password = hashPassword(password);

    const isUserExist = await User.findOne({ email });

    if (isUserExist) {
      return res.status(400).json({
        message: "User already exists",
        success: false,
      });
    }

    const otpCode = generateOtp();
    
    const existingOtp = await Otp.findOne({ email });
  
    if (existingOtp) {
      await Otp.deleteOne({ email });
    }

    const otp = new Otp({
      email,
      otpCode,
      expiresAt,
      isUsed: false,
      userName,
      password,
    });

    await otp.save();

    const emailResponse = await sendMailOtp(email, otpCode);

    if (!emailResponse.success) {
      return res.status(500).json({
        message: emailResponse.message,
        success: false,
      });
    }

    return res.status(201).json({
      message: "An Otp has been sent to your email.",
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

export async function createUser(req, res) {
  const { email, otp } = req.body;

  const { error } = validateOtpVerification({ email, otpCode: otp });
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
    });
  }

  try {
    const verifyOtp = await Otp.findOne({ email }).select(
      "userName password otpCode"
    );
    if (!verifyOtp || verifyOtp.otpCode !== otp) {
      return res.status(400).json({
        message: "Invalid OTP.",
        success: false,
      });
    }

    const { userName, password } = verifyOtp;

    const user = new User({
      userName,
      email,
      password,
    });

    await user.save();

    await Otp.deleteOne({ email: email, otpCode: otp });

    const mailOptions = {
      from: process.env.NODEMAILER_SENDER_MAIL,
      to: email,
      subject: `Welcome to the <span style="font-weight: 700; color: FF0000;">Duseca<span>!`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
          <header style="background-color: #4caf50; color: #fff; text-align: center; padding: 20px;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to <span style="font-weight: 700; color: FF0000;">Duseca<span></h1>
          </header>
          <main style="padding: 20px;">
            <p>Dear ${userName},</p>
            <p>We’re thrilled to have you on board! Thank you for signing up for <strong>Duseca</strong>.</p>
            <p>Here’s what you can do next:</p>
            <ul style="margin-left: 20px;">
              <li>Explore our features and services</li>
              <li>Update your profile information</li>
              <li>Reach out to our support team if you have any questions</li>
            </ul>
            <p>If you need assistance, feel free to reply to this email or visit our <a href="#" style="color: #4caf50; text-decoration: none;">Help Center</a>.</p>
            <p>Warm regards,</p>
            <p><strong>Your Company Team</strong></p>
          </main>
          <footer style="background-color: #f9f9f9; text-align: center; padding: 10px 20px; font-size: 12px; color: #777;">
            <p style="margin: 0;">You received this email because you signed up for <strong>Duseca</strong>.</p>
            <p style="margin: 0;">If you didn’t sign up, please ignore this email.</p>
            <p style="margin: 0;">© 2024 Duseca. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    const signUpMail = await sendSignupEmail(mailOptions);

    if (!signUpMail.isSend) {
      return res.status(500).json({
        message: "Failed to send email for verification.",
        success: false,
      });
    }

    return res.status(201).json({
      message: "User created successfully.",
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

