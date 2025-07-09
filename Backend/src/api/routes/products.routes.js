import express from "express";
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../controllers/products.controller.js";

import { verifyID } from "../middlewares/middlewares.js";

const productsRoutes = express.Router();

productsRoutes.get("/", obtenerProductos);
productsRoutes.get("/:id", verifyID, obtenerProductoPorId);
productsRoutes.post("/", crearProducto);
productsRoutes.post("/:id", verifyID, actualizarProducto);
productsRoutes.delete("/:id", verifyID, eliminarProducto);

export default productsRoutes;

//con los archivos .routes.js definimos las rutas HTTP para operaciones CRUD de productos.
//Aplicamos middlewares de validación (verifyID) en las rutas que requieren un ID válido.
//Cada ruta apunta a un controlador específico que maneja la lógica de la solicitud.