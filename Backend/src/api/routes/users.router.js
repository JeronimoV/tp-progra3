import express from "express";
import connection from "../database/db.js";
import { verifyID } from "../middlewares/middlewares.js";

let usersRoutes = express.Router();


usersRoutes.get("/", async(req, res) =>{
    
    try {
        let sql = "SELECT * FROM users";
        const [rows] = await connection.query(sql);
    
        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron usuarios" : "Usuarios encontrados"
        });
    
    } catch (error) {
        console.error("Error obteniendo usuarios", error)
        res.status(500).json({
            error: "Error interno del servidor al obtener usuarios"
        })
    }
})

usersRoutes.get("/:id", verifyID, async(req, res) =>{

    try {

        let { id } = req.params;
    
        let sql = `SELECT * FROM users where id = ?`;
    
        let [rows] = await connection.query(sql, [id]);
    
        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró el usuario con id: ${id}`
            })
        }
    
        res.status(200).json({
            payload: rows
        })
    } catch (error) {
        console.error(`Error al obtener usuario con id ${id}`, error.message);

        res.status(500).json({
            error: "Error interno al obtener un usuario por id"
        })
    }
})

usersRoutes.post("/", async (req,res) => {
    try {
        let {nombre, contraseña, admin} = req.body;
        let sql = `INSERT INTO users (nombre, contraseña, admin) VALUES (?,?,?)`

        let [rows] = await connection.query(sql, [nombre, contraseña, admin])

        res.status(200).json({
            payload: "Usuario creado"
        })
    } catch (error) {
        console.error(`Error al crear usuario`, error.message);

        res.status(500).json({
            error: "Error interno"
        })
    }
})

usersRoutes.delete("/:id", verifyID, async(req,res) => {
    try {

        let { id } = req.params;
    
        let sql = `DELETE FROM users WHERE id = ?`;
    
        let [rows] = await connection.query(sql, [id]);
    
        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró el usuario con id: ${id}`
            })
        }
    
        res.status(200).json({
            payload: rows
        })
    } catch (error) {
        console.error(`Error al eliminar`, error.message);

        res.status(500).json({
            error: "Error interno al eliminar"
        })
    }
})

export default usersRoutes;