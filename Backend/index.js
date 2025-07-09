import express from "express";
import enviroments from "./src/api/config/enviroments.js";
import cors from "cors";
import productsRoutes from "./src/api/routes/products.routes.js";
import usersRoutes from "./src/api/routes/users.routes.js";
import ventasRoutes from "./src/api/routes/ventas.routes.js";
import { join, __dirname } from "./src/api/utils/index.js";
import * as ProductsModel from "./src/api/models/products.models.js";
import { loggerUrl } from "./src/api/middlewares/middlewares.js";

const PORT = enviroments.port;
const app = express();

// Configuración del motor de plantillas EJS y carpeta de vistas
app.set("view engine", "ejs");
app.set("views", join(__dirname, "src/views"));

// Middlewares globales: CORS, parseo JSON, archivos estáticos y logger
app.use(cors());
app.use(express.json());
app.use(express.static(join(__dirname, "src/public")));
app.use(loggerUrl);

// Rutas principales para renderizado de vistas
app.get("/", (req, res) => {
    res.send("Hola mundo");
});

app.get("/bienvenida", (req, res) => {
    try {
        res.render("bienvenida");
    } catch (error) {
        console.error("Error al cargar bienvenida:", error.message);
        res.status(500).send("Error cargando la página de bienvenida");
    }
});

app.get("/main", async (req, res) => {
    try {
        res.render("main");
    } catch (error) {
        console.error("Error al cargar main:", error.message);
        res.status(500).send("Error cargando la página principal");
    }
});

app.get("/dashboard", async (req, res) => {
    try {
        const productos = await ProductsModel.getAllProducts();
        res.render("dashboard", { productos });
    } catch (error) {
        console.error("Error al cargar dashboard:", error.message);
        res.status(500).send("Error cargando productos");
    }
});

app.get("/modelado", (req, res) => {
    try {
        res.render("modelado");
    } catch (error) {
        console.error("Error al cargar página de creación:", error.message);
        res.status(500).send("Error cargando la página de creación de producto");
    }
});

app.get("/editado", (req, res) => {
    try {
        res.render("editado");
    } catch (error) {
        console.error("Error al cargar página de edición:", error.message);
        res.status(500).send("Error cargando la página de edición");
    }
});

app.get("/carrito", async (req, res) => {
    try {
        res.render("carrito");
    } catch (error) {
        console.error("Error al cargar carrito:", error.message);
        res.status(500).send("Error cargando el carrito");
    }
});

// Enrutadores específicos con middlewares (definidos en sus respectivos archivos)
app.use("/products", productsRoutes);
app.use("/users", usersRoutes);
app.use("/ventas", ventasRoutes);

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});