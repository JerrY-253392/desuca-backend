import nodemailer from "nodemailer";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

export async function sendMail(subject, content, navigationLink, receiver) {
  let message;
  let isSend = false;

  if (
    !process.env.NODEMAILER_USER ||
    !process.env.NODEMAILER_PASS ||
    !process.env.NODEMAILER_SENDER_MAIL
  ) {
    console.error("Nodemailer environment variables are missing.");
    return { message: "Mail configuration is missing.", isSend: false };
  }

  const transporter = nodemailer.createTransport({
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  // Calculate expiration time (e.g., 2 days = 48 hours)
  const expirationTime = Date.now() + 2 * 24 * 60 * 60 * 1000; // 2 days in ms
  const token = crypto.randomBytes(16).toString("hex"); // Generate a unique token
  const linkWithExpiration = `${navigationLink}?token=${token}&expires=${expirationTime}`;

  const mailOptions = {
    from: process.env.NODEMAILER_SENDER_MAIL,
    to: receiver,
    subject: subject,
    html: `
      <p>${content}</p>
      <p><a href="${linkWithExpiration}" target="_blank">Sign Up Now</a></p>
      <p>This link will expire on ${new Date(
        expirationTime
      ).toLocaleString()}.</p>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    message = "An email has been sent to Attorney.";
    isSend = true;
  } catch (error) {
    console.error("Error sending email:", error);
    message = "There is an issue in sending verification mail.";
    isSend = false;
  }

  return { message, isSend };
}


export async function sendMailOtp(reciever, otpCode) {
  try {
    const transporter = nodemailer.createTransport({
      secure: true,
      service: 'gmail',
      auth: {
        user: process.env.NODEMAILER_USER,
        pass: process.env.NODEMAILER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_SENDER_MAIL,
      to: reciever,
      subject: "Verify Your Email",
      html: `<div>
             <h2>Your OTP Code</h2>
             <p>Please use the following OTP to verify your account:</p>
             <h3>${otpCode}</h3>
             <p>This OTP is valid for 1 hour.</p>
           </div>`,
    };

    await transporter.sendMail(mailOptions);

    return { success: true, message: "OTP email sent successfully." };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, message: "Error sending OTP email." };
  }
}

export const sendSignupEmail = async (mailOptions) => {
  let message;
  let isSend = false;

  const transporter = nodemailer.createTransport({
    secure: true,
    service: 'gmail',
    auth: {
      user: process.env.NODEMAILER_USER,
      pass: process.env.NODEMAILER_PASS,
    },
  });

  try {
    const info = await transporter.sendMail(mailOptions);
    message = "Email sent successfully";
    isSend = true;
  } catch (error) {
    console.error("Error sending signup email:", error);
    message = "There was an issue in sending the verification email.";
    isSend = false;
  }
  return { message, isSend };
};
