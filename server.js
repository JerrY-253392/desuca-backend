
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./src/config/db.js";
import { ADMIN_BASE_URL, AUTH_BASE_URL, MANAGER_BASE_URL, TASK_BASE_URL, USER_BASE_URL } from "./constant.js";
import AuthRouter from "./src/routes/auth.routes.js";
import AdminRouter from "./src/routes/admin.routes.js";
import UserRouter from "./src/routes/user.routes.js";
import ManagerRouter from "./src/routes/manager.routes.js";
import TaskRouter from "./src/routes/task.routes.js";

const port = process.env.PORT || 8080;
const app = express();

dotenv.config();
connectDB();


app.use(cors())
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.get("/", (req, res) => {
  res.send("Welcome to Duseca Task Backend");
});

app.use(AUTH_BASE_URL, AuthRouter)
app.use(ADMIN_BASE_URL, AdminRouter)
app.use(MANAGER_BASE_URL, ManagerRouter)
app.use(USER_BASE_URL, UserRouter)
app.use(TASK_BASE_URL,TaskRouter)


app.listen(port, () => {
  console.log(`App started on port ${port}`);
});