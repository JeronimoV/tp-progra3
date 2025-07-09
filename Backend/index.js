import express from "express";
import enviroments from "./src/api/config/enviroments.js";
import cors from "cors";
import productsRoutes from "./src/api/routes/products.routes.js";
import usersRoutes from "./src/api/routes/users.routes.js";
import ventasRoutes from "./src/api/routes/ventas.routes.js";

const PORT = enviroments.port;
const app = express();


// Middlewares

app.use(cors()); //Middleware CORS que permite todas las solicitudes
app.use(express.json())

// Testeo //
app.get("/", (req, res) =>{
    res.send("Hola mundo");
});

app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/ventas", ventasRoutes);



app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})

