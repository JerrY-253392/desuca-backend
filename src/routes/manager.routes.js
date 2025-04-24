import express from "express";
import {
  createManager,
  deleteManager,
  getManagerBYId,
  getManagers,
  getTaskById,
  updateManager,
} from "../controllers/Manager/manager.controller.js";

const ManagerRouter = express.Router();

ManagerRouter.use(express.json());

ManagerRouter.post("/create", createManager);
ManagerRouter.get("/getbyid/:id", getManagerBYId);
ManagerRouter.get("/getTaskById/:id", getTaskById);
ManagerRouter.patch("/update/:id", updateManager);
ManagerRouter.delete("/delete/:id", deleteManager);
ManagerRouter.get("/getall", getManagers);

export default ManagerRouter;

// http://localhost:5000/api/manager/user/create
// {
//     "userName": "Maqnager User",
//     "email": "maanger@gmail.com",
//     "password": "manager"
//   }

//   http://localhost:5000/api/manager/user/getbyid/6808dbbbe10da95e0633d790

//   http://localhost:5000/api/manager/user/update/6808dbbbe10da95e0633d790
//   {
//     "userName": "Maqnager User",
//     "email": "maanger@gmail.com",
//     "password": "manager",
//     "managedUsers": [
//       "6808d52dbe295c3c998f083f"
//     ]
//   }

//   http://localhost:5000/api/manager/user/delete/6808dc40e10da95e0633d795
//   http://localhost:5000/api/manager/user/getall
