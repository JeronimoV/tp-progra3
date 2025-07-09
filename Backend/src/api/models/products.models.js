import connection from "../database/db.js";

export async function getAllProducts() {
    const [rows] = await connection.query("SELECT * FROM products");
    return rows;
}

export async function getProductById(id) {
    const [rows] = await connection.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0];
}

export async function createProduct({ imagen, nombre, precio, estado = true, categoria }) {
    const sql = `INSERT INTO products (imagen, nombre, precio, estado, categoria) VALUES (?, ?, ?, ?, ?)`;
    const [result] = await connection.query(sql, [imagen, nombre, precio, estado, categoria]);
    return result;
}

export async function updateProduct(id, { imagen, nombre, precio, estado, categoria }) {
    const sql = `UPDATE products SET imagen = ?, nombre = ?, precio = ?, estado = ?, categoria = ? WHERE id = ?`;
    const [result] = await connection.query(sql, [imagen, nombre, precio, estado, categoria, id]);
    return result;
}

export async function deleteProduct(id) {
    const sql = `DELETE FROM products WHERE id = ?`;
    const [result] = await connection.query(sql, [id]);
    return result;
}