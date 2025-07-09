import express from "express";
import { crearVenta } from "../controllers/ventas.controller.js";

const ventasRoutes = express.Router();

ventasRoutes.post("/", crearVenta);

export default ventasRoutes;