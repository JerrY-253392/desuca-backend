import bcrypt from "bcryptjs";
import { User } from "../../models/userModal.js";
import { Manager } from "../../models/managerModal.js";

export async function createUser(req, res) {
  const { userName, email, password, role } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User with this email already exists.",
        success: false,
      });
    }

    let newUser;

    if (role === "manager") {
      newUser = new Manager({
        userName,
        email,
        password: hashedPassword,
        role: "manager",
      });
    } else {
      newUser = new User({
        userName,
        email,
        password: hashedPassword,
        role: "user",
      });
    }

    await newUser.save();

    return res.status(201).json({
      message: "User created successfully.",
      success: true,
      data: newUser,
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

export async function getUserBYId(req, res) {
  const { id } = req.params;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User found.",
      success: true,
      data: user,
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

export async function updateUser(req, res) {
  const { id } = req.params;
  const { userName, email, password, role } = req.body;

  try {
    const updatedData = { userName, email, role };

    if (password) {
      updatedData.password = bcrypt.hashSync(password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User updated successfully.",
      success: true,
      data: updatedUser,
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

export async function deleteUser(req, res) {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "User deleted successfully.",
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

export async function getUsers(req, res) {
  try {
    const [users, managers] = await Promise.all([
      User.find(),
      Manager.find().populate("managedUsers"),
    ]);

    const combinedData = [...users, ...managers];

    return res.status(200).json({
      message: "Users and Managers fetched successfully.",
      success: true,
      data: combinedData,
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

export async function whoAmI(req, res) {
  try {
    console.log(req.user);

    const users = await User.findById(req.user.id).select("-password");
    console.log("users", users);

    return res.status(200).json({
      message: "User fetched successfully.",
      success: true,
      data: users,
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

//EXAMPLE POSTMAN REQUEST BODY FOR CREATE
// {
//     "username": "user",
//     "email": "user@example.com",
//     "password": "123456789",
//   },
