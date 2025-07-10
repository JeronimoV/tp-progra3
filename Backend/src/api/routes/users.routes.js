import express from "express";
import { verifyID } from "../middlewares/middlewares.js";
import {
  getAllUsers,
  getUserByNombre,
  createUser,
  deleteUser,
  createAdmin
} from "../controllers/users.controller.js";

let usersRoutes = express.Router();

usersRoutes.get("/", getAllUsers);
usersRoutes.get("/:nombre", getUserByNombre);
usersRoutes.post("/", createUser);
usersRoutes.post("/admin/create", createAdmin);
usersRoutes.delete("/:id", verifyID, deleteUser);

export default usersRoutes;