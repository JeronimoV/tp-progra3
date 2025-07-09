import connection from "../database/db.js";

export async function createVenta(id_usuario) {
    const sql = `INSERT INTO ventas (id_usuario) VALUES (?)`;
    const [result] = await connection.query(sql, [id_usuario]);
    return result;
}

export async function createDetalleVenta(id_venta, id_productos, cantidad) {
    const sql = `INSERT INTO ventas_productos (id_ventas, id_productos, cantidad) VALUES (?, ?, ?)`;
    const [result] = await connection.query(sql, [id_venta, id_productos, cantidad]);
    return result;
}