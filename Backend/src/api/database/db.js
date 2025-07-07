import mysql from "mysql2/promise"; //importamos modulo en promesa

//Traemos los datos de conexion de nuestro archivo de variable de entorno
import enviroments from "../config/enviroments.js";

const { database } = enviroments;

const connection = mysql.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection;

