import express from "express";
import { createAdmin, deleteAdmin, getAdminById, getAdmins, updateAdmin, whoAmI } from "../controllers/Admin/admin.controller.js";
import { verifyJWT } from "../middlewares/auth.js";

const AdminRouter = express.Router();

AdminRouter.use(express.json());

AdminRouter.post("/create", createAdmin);
AdminRouter.get("/getbyid/:id", getAdminById);
AdminRouter.get("/who-am-I", verifyJWT ,whoAmI);

AdminRouter.patch("/update/:id", updateAdmin);
AdminRouter.delete("/delete/:id", deleteAdmin);
AdminRouter.get("/getall", getAdmins);


export default AdminRouter;


// http://localhost:5000/api/admin/user/create
// {
// "username": "Admin User",
// "email": "admin@gmail.com",
// "password": "admin"
// }

// http://localhost:5000/api/admin/user/getbyid/6808d8ee2ce20cf644df8c80


// http://localhost:5000/api/admin/user/update/6808d8ee2ce20cf644df8c80
// {
//     "username": "Admin23 User",
//     "email": "admin22@gmail.com",
//     "password": "admin"
//   }

// http://localhost:5000/api/admin/user/delete/6808d8ee2ce20cf644df8c80

// http://localhost:5000/api/admin/user/getall