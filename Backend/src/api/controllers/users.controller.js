import * as UsersModel from "../models/users.models.js";

export async function getAllUsers(req, res) {
    try {
        const usuarios = await UsersModel.getAllUsers();
        res.status(200).json({
            payload: usuarios,
            message: usuarios.length === 0 ? "No se encontraron usuarios" : "Usuarios encontrados"
        });
    } catch (error) {
        console.error("Error obteniendo usuarios", error);
        res.status(500).json({ error: "Error interno del servidor al obtener usuarios" });
    }
}

export async function getUserByNombre(req, res) {
    try {
        const { nombre } = req.params;
        const usuarios = await UsersModel.getUserByNombre(nombre);
        if (usuarios.length === 0) {
            return res.status(404).json({
                error: `No se encontró el usuario con nombre: ${nombre}`,
                find: false
            });
        }
        res.status(200).json({ payload: usuarios, find: true });
    } catch (error) {
        console.error(`Error al obtener usuario con nombre ${nombre}`, error.message);
        res.status(500).json({ error: "Error interno al obtener un usuario por nombre" });
    }
}

export async function createUser(req, res) {
    try {
        const { nombre, contraseña, admin } = req.body;
        const result = await UsersModel.createUser({ nombre, contraseña, admin });
        res.status(201).json({ payload: "Usuario creado", id: result.insertId });
    } catch (error) {
        console.error("Error al crear usuario", error.message);
        res.status(500).json({ error: "Error interno" });
    }
}

export async function deleteUser(req, res) {
    try {
        const { id } = req.params;
        const result = await UsersModel.deleteUser(id);
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: `No se encontró el usuario con id: ${id}` });
        }
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        console.error("Error al eliminar usuario", error.message);
        res.status(500).json({ error: "Error interno al eliminar" });
    }
}