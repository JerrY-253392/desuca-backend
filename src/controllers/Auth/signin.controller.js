import jwt from "jsonwebtoken";
import { hashPassword, isPasswordCorrect } from "../../utils/bcrypt.util.js";
import { User, validateSignin } from "../../models/userModal.js";
import { Admin } from "../../models/adminModal.js";
import { Manager } from "../../models/managerModal.js";

export async function signIn(req, res) {
  const { email, password } = req.body;

  const { error } = validateSignin({ email, password });
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      success: false,
    });
  }

  try {
    const [admin, manager, user] = await Promise.all([
      Admin.findOne({ email }).select("userName password role email"),
      Manager.findOne({ email }).select("userName password role email"),
      User.findOne({ email }).select("userName password role email"),
    ]);

    const foundUser = admin || manager || user;

    if (!foundUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    const isValidPassword = isPasswordCorrect(password, foundUser.password);
    if (!isValidPassword) {
      return res.status(400).json({
        message: "Uh-oh! It seems like your password is incorrect..",
        success: false,
      });
    }

    const token = jwt.sign(
      { id: foundUser._id, email: foundUser.email, role: foundUser.role },
      process.env.JWT_SECRET
    );

    return res.status(200).json({
      message: "Login successful.",
      success: true,
      token,
      user: {
        id: foundUser._id,
        userName: foundUser.userName,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (error) {
    console.error("Error during sign-in:", error);
    return res.status(500).json({
      message: "Internal server error.",
      success: false,
      issue: error.message,
    });
  }
}

export const updateProfile = async (req, res) => {
  try {
    const { userName, email, role, password } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required.",
        success: false,
      });
    }

    const [user, manager, admin] = await Promise.all([
      User.findOne({ email }),
      Manager.findOne({ email }),
      Admin.findOne({ email }),
    ]);

    const foundUser = user || manager || admin;

    if (!foundUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    if (userName) foundUser.userName = userName;
    if (password) foundUser.password = hashPassword(password);

    await foundUser.save();

    return res.status(200).json({
      message: "Profile updated successfully.",
      success: true,
      user: {
        userName: foundUser.userName,
        email: foundUser.email,
        role: foundUser.role,
        password,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return res.status(500).json({
      message: "An error occurred while updating the profile.",
      success: false,
    });
  }
};
