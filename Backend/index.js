import express from "express";
import enviroments from "./src/api/config/enviroments.js";
import connection from "./src/api/database/db.js";

const PORT = enviroments.port;
const app = express();


// Testeo //
app.get("/", (req, res) =>{
    res.send("Hola mundo");
});


//Traer todos los productos

app.get("/products", async(req, res) =>{
    let sql = "SELECT * FROM products";
    const [rows] = await connection.query(sql);

    res.status(200).json({
        payload: rows
    });
})



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

