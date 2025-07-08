import express from "express";
import connection from "../database/db.js";
import { verifyID } from "../middlewares/middlewares.js";

let ventasRoutes = express.Router();

ventasRoutes.post("/",async(req, res) =>{
    try {
        let {id_usuario, id_productos, cantidad} = req.body;
        let sql = `INSERT INTO ventas (id_usuario) VALUES (?)`

        let [rows] = await connection.query(sql, [id_usuario])

        let sql2 = "INSERT INTO ventas_productos (id_ventas, id_productos, cantidad) VALUES (?,?,?)"

        let id_venta = rows.insertId;

        await connection.query(sql2, [id_venta, id_productos, cantidad])

        res.status(200).json({
            payload: "Venta creado"
        })
    } catch (error) {
        console.error(`Error al crear venta`, error.message);

        res.status(500).json({
            error: "Error interno"
        })
    }
})

export default ventasRoutes