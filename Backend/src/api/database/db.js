import mysql from "mysql2/promise"; //importamos modulo en promesa

//Traemos los datos de conexion de nuestro archivo de variable de entorno para mayor seguridad.
import enviroments from "../config/enviroments.js";

const { database } = enviroments;

const connection = mysql.createPool({
    host: database.host,
    database: database.name,
    user: database.user,
    password: database.password
});

export default connection;

//Justamente com se vió en la catedra
//El pool permite manejar múltiples conexiones eficientes 
//para consultas asincrónicas en la aplicación.
