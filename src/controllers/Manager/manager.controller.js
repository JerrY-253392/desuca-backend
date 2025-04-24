import bcrypt from "bcryptjs"; // For password hashing
import { Manager } from "../../models/managerModal.js";
import Task from "../../models/taskModal.js";

export async function createManager(req, res) {
  const { userName, email, password, managedUsers } = req.body;

  try {
    // Hash the password before saving
    const hashedPassword = bcrypt.hashSync(password, 10);

    // Check if the manager already exists
    const existingManager = await Manager.findOne({ email });
    if (existingManager) {
      return res.status(400).json({
        message: "Manager with this email already exists.",
        success: false,
      });
    }

    // Create a new manager
    const newManager = new Manager({
      userName,
      email,
      password: hashedPassword,
      managedUsers: managedUsers || [], // Assigning users that the manager will be responsible for
    });

    await newManager.save();

    return res.status(201).json({
      message: "Manager created successfully.",
      success: true,
      data: newManager,
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

export async function getManagerBYId(req, res) {
  const { id } = req.params;

  try {
    const manager = await Manager.findById(id).populate("managedUsers"); // Populates the managed users (the list of users the manager is responsible for)

    if (!manager) {
      return res.status(404).json({
        message: "Manager not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Manager found.",
      success: true,
      data: manager,
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

export async function updateManager(req, res) {
  const { id } = req.params;

  const { userName, email, password, managedUsers } = req.body;
  console.log("first", req.body);
  try {
    let updatedData = {};
    if (userName) {
      updatedData.userName = userName;
    }
    if (email) {
      updatedData.email = email;
    }
    if (managedUsers.length > 0) {
      updatedData.managedUsers = managedUsers;
    }

    // Hash the password if provided
    if (password) {
      updatedData.password = bcrypt.hashSync(password, 10);
    }

    const updatedManager = await Manager.findByIdAndUpdate(id, updatedData, {
      new: true,
    });

    if (!updatedManager) {
      return res.status(404).json({
        message: "Manager not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Manager updated successfully.",
      success: true,
      data: updatedManager,
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

export async function deleteManager(req, res) {
  const { id } = req.params;

  try {
    const deletedManager = await Manager.findByIdAndDelete(id);

    if (!deletedManager) {
      return res.status(404).json({
        message: "Manager not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Manager deleted successfully.",
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

export async function getManagers(req, res) {
  try {
    const managers = await Manager.find().populate("managedUsers"); // Populates the users each manager is responsible for

    return res.status(200).json({
      message: "Managers fetched successfully.",
      success: true,
      data: managers,
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

export async function getTaskById(req, res) {
  const { id } = req.params;

  try {
    const user = await Manager.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "Manager not found.",
        success: false,
      });
    }
    const tasks = await Task.find({
      creatorId: id,
    });
    if (!tasks) {
      return res.status(404).json({
        message: "Tasks not found.",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Tasks fetched successfully.",
      success: true,
      data: tasks,
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
//     "userName": "manager",
//     "email": "manager@examople.com",
//     "password": "securePassword123",
//     "managedUsers": ["60d5f94f1c6b520010b4e9f9", "60d5f94f1c6b520010b4e9f1"]
//   }
