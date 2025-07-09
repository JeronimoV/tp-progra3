import connection from "../database/db.js";

export async function getAllUsers() {
    const [rows] = await connection.query("SELECT * FROM users");
    return rows;
}

export async function getUserByNombre(nombre) {
    const [rows] = await connection.query("SELECT * FROM users WHERE nombre = ?", [nombre]);
    return rows;
}

export async function createUser({ nombre, contraseña, admin }) {
    const sql = `INSERT INTO users (nombre, contraseña, admin) VALUES (?, ?, ?)`;
    const [result] = await connection.query(sql, [nombre, contraseña, admin]);
    return result;
}

export async function deleteUser(id) {
    const sql = `DELETE FROM users WHERE id = ?`;
    const [result] = await connection.query(sql, [id]);
    return result;
}