import express from "express";
import connection from "../database/db.js";
import { verifyID } from "../middlewares/middlewares.js";

let productsRoutes = express.Router();

//Primer endpoint GET, traer todos los productos

productsRoutes.get("/", async(req, res) =>{
    
    try {
        let sql = "SELECT * FROM products";
        const [rows] = await connection.query(sql);
    
        res.status(200).json({
            payload: rows,
            message: rows.length === 0 ? "No se encontraron usuarios" : "Usuarios encontrados"
        });
    
    } catch (error) {
        console.error("Error obteniendo productos", error)
        res.status(500).json({
            error: "Error interno del servidor al obtener productos"
        })
    }
})

// Segundo enndpoint GET by id, traer producto por su id

//NOTA PARA JERITO: CAPAZ SIRVE DE ALGO, EL ENDPOINT DE ARRIBA SI LO USE PARA YA REMPLAZAR EL JSON, este endpoint lo hice por las dudas nomás 
//DE JERO PARA TIZI: GRACIAS AMIGO, LO APRECIO MUCHO
productsRoutes.get("/:id", verifyID,async(req, res) =>{

    try {

        let { id } = req.params;
    
        let sql = `SELECT * FROM products where id = ?`;
    
        let [rows] = await connection.query(sql, [id]);
    
        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró el producto con id: ${id}`
            })
        }
    
        res.status(200).json({
            payload: rows
        })
    } catch (error) {
        console.error(`Error al obtener producto con id ${id}`, error.message);

        res.status(500).json({
            error: "Error interno al obtener un producto por id"
        })
    }
})

productsRoutes.post("/", async (req,res) => { //Hola Tizi, este crea productos
    try {
        let {imagen, nombre, precio, categoria} = req.body;
        let sql = `INSERT INTO products (imagen, nombre, precio, estado, categoria) VALUES (?,?,?,?,?)`

        let [rows] = await connection.query(sql, [imagen, nombre, precio, true, categoria])

        res.status(200).json({
            payload: "Producto creado"
        })
    } catch (error) {
        console.error(`Error al crear producto`, error.message);

        res.status(500).json({
            error: "Error interno"
        })
    }
})

productsRoutes.post("/:id", verifyID,async(req,res) => { // Hola tizi, soy yo de nuevo, este es para actualizar un producto con su id
    try {
        let {id} = req.params;
        let {imagen, nombre, precio, estado, categoria} = req.body;

        let sql = `UPDATE products SET imagen = ?, nombre = ?, precio = ?, estado = ?, categoria = ? WHERE id = ?`;

        let [rows] = await connection.query(sql, [imagen, nombre, precio, estado, categoria, id]);
    
        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró el producto con id: ${id}`
            })
        }
    
        res.status(200).json({
            payload: rows
        })
    } catch (error) {
        console.error(`Error al editar producto`, error.message);

        res.status(500).json({
            error: "Error interno"
        })
    }
})

productsRoutes.delete("/:id", verifyID, async(req,res) => {
    try {

        let { id } = req.params;
    
        let sql = `DELETE FROM products WHERE id = ?`;
    
        let [rows] = await connection.query(sql, [id]);
    
        if(rows.length === 0) {
            return res.status(404).json({
                error: `No se encontró el producto con id: ${id}`
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

export default productsRoutes;