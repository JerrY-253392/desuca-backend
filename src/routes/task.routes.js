
import express from "express";
import { createTask, deleteTask, getAllTasks, getAllTasksOfUser, getTaskBYId, updateTask } from "../controllers/Task/task.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const TaskRouter = express.Router();

TaskRouter.use(express.json());

TaskRouter.post("/create", createTask);
TaskRouter.get("/getusertask", verifyJWT ,getAllTasksOfUser);
TaskRouter.get("/getbyid/:id", getTaskBYId);
TaskRouter.patch("/update/:id", updateTask);
TaskRouter.delete("/delete/:id", deleteTask);
TaskRouter.get("/getall", getAllTasks);


export default TaskRouter;

// http://localhost:5000/api/task/create
// {
//     "title": "Complete Monthly Report",
//     "description": "Finish the monthly report and send it to the management team.",
//     "creatorId": "6808d543be295c3c998f0843",  
//     "assignedTo": "6808d543be295c3c998f0843",
//     "dueDate": "2025-05-10T23:59:59Z",
//     "status":"pending",
//     "creatorModel": "User",  
//     "assignedModel": "User"  
// }

// http://localhost:5000/api/task/getbyid/6808dd1095c268ad6120f260

// http://localhost:5000/api/task/update/6808dd1095c268ad6120f260
// {
//     "title": " Report",
//     "description": " report and send it to the management team.",
//     "creatorId": "6808d8a02ce20cf644df8c77",  
//     "assignedTo": "6808d543be295c3c998f0843",
//     "dueDate": "2025-05-10T23:59:59Z",
//     "status":"pending",
//     "creatorModel": "Admin",  
//     "assignedModel": "User"  
// }

// http://localhost:5000/api/task/delete/6808dd1095c268ad6120f260
// http://localhost:5000/api/task/getall
