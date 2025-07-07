import express from "express";
import enviroments from "./src/api/config/enviroments.js";
import connection from "./src/api/database/db.js";
import cors from "cors";

const PORT = enviroments.port;
const app = express();


// Middlewares

app.use(cors()); //Middleware CORS que permite todas las solicitudes

// Testeo //
app.get("/", (req, res) =>{
    res.send("Hola mundo");
});


//Primer endpoint GET, traer todos los productos

app.get("/products", async(req, res) =>{
    
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
app.get("products/:id", async(req, res) =>{

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


app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

