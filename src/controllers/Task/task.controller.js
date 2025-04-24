import Task from "../../models/taskModal.js";
import { User } from "../../models/userModal.js";
import { Admin } from "../../models/adminModal.js";
import { Manager } from "../../models/managerModal.js";

export const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      status,
      creatorId,
      assignedTo,
      dueDate,
      priority,
      creatorModel,
      assignedModel,
    } = req.body;
    console.log(creatorId);

    if (!creatorId || !creatorModel || !assignedModel) {
      return res.status(400).json({
        message: "creatorId, creatorModel, and assignedModel are required.",
        success: false,
      });
    }

    const creator =
      (await User.findById(creatorId)) ||
      (await Admin.findById(creatorId)) ||
      (await Manager.findById(creatorId));

    if (!creator) {
      return res.status(404).json({
        message: "Creator not found.",
        success: false,
      });
    }

    if (assignedTo) {
      const assignee =
        (await User.findById(assignedTo)) ||
        (await Manager.findById(assignedTo)) ||
        (await Admin.findById(assignedTo));
      if (!assignee) {
        return res.status(404).json({
          message: "Assigned user not found.",
          success: false,
        });
      }
    }

    if (creatorModel === "Admin") {
    } else if (creatorModel === "Manager") {
      const manager = await Manager.findById(creatorId);
      if (assignedTo && !manager.managedUsers.includes(assignedTo)) {
        return res.status(403).json({
          message: "Manager can only assign tasks to users they manage.",
          success: false,
        });
      }
    } else if (creatorModel === "User") {
      if (assignedTo && assignedTo !== creatorId) {
        return res.status(403).json({
          message: "User can only create tasks for themselves.",
          success: false,
        });
      }
    }

    // Create the new task
    const newTask = new Task({
      title,
      description,
      creatorId,
      assignedTo,
      dueDate,
      priority,
      status: status,
      creatorModel:
        String(creatorModel).charAt(0).toUpperCase() +
        String(creatorModel).slice(1),
      assignedModel:
        String(assignedModel).charAt(0).toUpperCase() +
        String(assignedModel).slice(1),
    });

    await newTask.save();

    return res.status(201).json({
      message: "Task created and assigned successfully.",
      success: true,
      task: newTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(500).json({
      message: "An error occurred while creating the task.",
      success: false,
      issue: error.message,
    });
  }
};

export const getTaskBYId = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findById(id)
      .populate("creatorId")
      .populate("assignedTo");

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task fetched successfully.",
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    return res.status(500).json({
      message: "An error occurred while fetching the task.",
      success: false,
      issue: error.message,
    });
  }
};

export const getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate("assignedTo")
      .populate("creatorId");

    return res.status(200).json({
      message: "Tasks fetched successfully.",
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      message: "An error occurred while fetching tasks.",
      success: false,
      issue: error.message,
    });
  }
};

export const getAllTasksOfUser = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user.id })
      .populate("creatorId")
      .populate("assignedTo");

    return res.status(200).json({
      message: "Tasks fetched successfully.",
      success: true,
      tasks,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      message: "An error occurred while fetching tasks.",
      success: false,
      issue: error.message,
    });
  }
};

export const updateTask = async (req, res) => {
  console.log("hehehehe =================> ", req.body);
  try {
    const { id } = req.params;
    let {
      title,
      description,
      status,
      assignedTo,
      creatorId,
      dueDate,
      priority,
      creatorModel,
      assignedModel,
    } = req.body;

    const task = await Task.findById(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
        success: false,
      });
    }

    if (title) task.title = title;
    if (description) task.description = description;
    if (status) task.status = status;
    if (creatorId) task.creatorId = creatorId;
    if (assignedTo) task.assignedTo = assignedTo;
    if (dueDate) task.dueDate = dueDate;
    if (priority) task.priority = priority;
    if (creatorModel) task.creatorModel = creatorModel;
    if (assignedModel) task.assignedModel = assignedModel;

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully.",
      success: true,
      task,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      message: "An error occurred while updating the task.",
      success: false,
      issue: error.message,
    });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Task deleted successfully.",
      success: true,
    });
  } catch (error) {
    console.error("Error deleting task:", error);
    return res.status(500).json({
      message: "An error occurred while deleting the task.",
      success: false,
      issue: error.message,
    });
  }
};

// {
//     "title": "Complete Monthly Report",
//     "description": "Finish the monthly report and send it to the management team.",
//     "creatorId": "60d5f94f1c6b520010b4e9f8",  // Admin's ID
//     "assignedTo": "60d5f94f1c6b520010b4e9f9",  // User's ID
//     "dueDate": "2025-05-10T23:59:59Z",
//     "status":"pending",
//     "creatorModel": "Admin",  // Creator is Admin
//     "assignedModel": "User"  // Assignee is User
//   }
