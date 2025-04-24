
import express from "express";
import { createUser, deleteUser, getUserBYId, getUsers, updateUser, whoAmI } from "../controllers/User/user.controller.js";
import {verifyJWT} from "../middlewares/auth.js";

const UserRouter = express.Router();

UserRouter.use(express.json());

UserRouter.post("/create", createUser);

UserRouter.get("/getbyid/:id", getUserBYId);
UserRouter.get("/who-am-I", verifyJWT ,whoAmI);
UserRouter.patch("/update/:id", updateUser);
UserRouter.delete("/delete/:id", deleteUser);
UserRouter.get("/getall", getUsers);


export default UserRouter;


// http://localhost:5000/api/simpleUser/user/getall
// http://localhost:5000/api/simpleUser/user/getbyid/6808b8b84fb6b621936c5e6a

// http://localhost:5000/api/simpleUser/user/update/6808b8b84fb6b621936c5e6a
// {
//     "userName": "Test User"
//     "email":
//     "password": ""
// }

// http://localhost:5000/api/simpleUser/user/create
// {
//     "userName": "Test User 1",
//         "email": "testuser@gmail.com",
//             "password": "123456789"
// }

// http://localhost:5000/api/simpleUser/user/delete/6808d549be295c3c998f0846

