// Con los controller.js implementamos la lógica para cada endpoint del del recurso productos
// Obtenemos todos o uno por ID, manejando casos de no encontrado
//creamos, eliminamos y actualizamos productos con control de errores como se enseñó en la catedra.
// respondemos con JSON adecuados según el resultado de la operación.

//En resumen, si se puede sacar a conclusión, actúa como intermediario entre la petición HTTP y las funciones de modelo (DB).


import * as ProductsModel from "../models/products.models.js";

export async function obtenerProductos(req, res) {
    try {
        const productos = await ProductsModel.getAllProducts();
        res.status(200).json({
            payload: productos,
            message: productos.length === 0 ? "No se encontraron productos" : "Productos encontrados"
        });
    } catch (error) {
        console.error("Error al obtener productos:", error.message);
        res.status(500).json({ error: "Error interno" });
    }
}

export async function obtenerProductoPorId(req, res) {
    try {
        const { id } = req.params;
        const producto = await ProductsModel.getProductById(id);
        if (!producto) {
            return res.status(404).json({ error: `No se encontró el producto con id: ${id}` });
        }
        res.status(200).json({ payload: producto });
    } catch (error) {
        console.error("Error al obtener producto por id:", error.message);
        res.status(500).json({ error: "Error interno" });
    }
}

export async function crearProducto(req, res) {
    try {
        const { imagen, nombre, precio, categoria } = req.body;
        const result = await ProductsModel.createProduct({ imagen, nombre, precio, categoria });
        res.status(201).json({ message: "Producto creado", id: result.insertId });
    } catch (error) {
        console.error("Error al crear producto:", error.message);
        res.status(500).json({ error: "Error interno" });
    }
}

export async function actualizarProducto(req, res) {
    try {
        const { id } = req.params;
        const { imagen, nombre, precio, estado, categoria } = req.body;
        const result = await ProductsModel.updateProduct(id, { imagen, nombre, precio, estado, categoria });
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `No se encontró el producto con id: ${id}` });
        }
        res.status(200).json({ message: "Producto actualizado" });
    } catch (error) {
        console.error("Error al actualizar producto:", error.message);
        res.status(500).json({ error: "Error interno" });
    }
}

export async function eliminarProducto(req, res) {
    try {
        const { id } = req.params;
        const result = await ProductsModel.deleteProduct(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `No se encontró el producto con id: ${id}` });
        }
        res.status(200).json({ message: "Producto eliminado" });
    } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        res.status(500).json({ error: "Error interno" });
    }
}