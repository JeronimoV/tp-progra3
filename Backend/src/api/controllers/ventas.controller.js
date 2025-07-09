import * as VentasModel from "../models/ventas.models.js";

export async function crearVenta(req, res) {
    try {
        const { id_usuario, id_productos, cantidad } = req.body;

        const ventaResult = await VentasModel.createVenta(id_usuario);
        const id_venta = ventaResult.insertId;

        await VentasModel.createDetalleVenta(id_venta, id_productos, cantidad);

        res.status(200).json({ payload: "Venta creada correctamente" });
    } catch (error) {
        console.error("Error al crear venta:", error.message);
        res.status(500).json({ error: "Error interno al registrar la venta" });
    }
}