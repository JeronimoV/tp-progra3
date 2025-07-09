import express from "express";
import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from "../controllers/products.controller.js";

const productsRoutes = express.Router();

productsRoutes.get("/", obtenerProductos);
productsRoutes.get("/:id", obtenerProductoPorId);
productsRoutes.post("/", crearProducto);
productsRoutes.post("/:id", actualizarProducto);
productsRoutes.delete("/:id", eliminarProducto);

export default productsRoutes;