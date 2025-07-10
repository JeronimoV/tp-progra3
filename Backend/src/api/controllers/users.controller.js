import bcrypt from "bcrypt";
import * as UsersModel from "../models/users.models.js";

// Crea un usuario administrador nuevo con contraseña hasheada
// Valida que los datos no estén vacíos
// Verifica que no exista otro usuario con el mismo nombre
// Hashea la contraseña con bcrypt antes de guardar
// Devuelve 201 si se creó con éxito, o error si falla
export async function createAdmin(req, res) {
  try {
    const { nombre, contraseña } = req.body;
    if (!nombre || !contraseña) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Verificar si usuario ya existe
    const usuariosExistentes = await UsersModel.getUserByNombre(nombre);
    if (usuariosExistentes.length > 0) {
      return res.status(409).json({ error: "Usuario ya existe" });
    }

    // Hashear contraseña
    const hash = await bcrypt.hash(contraseña, 10);

    // Crear usuario admin
    const result = await UsersModel.createUser({
      nombre,
      contraseña: hash,
      admin: true,
    });

    return res.status(201).json({ mensaje: "Admin creado", id: result.insertId });
  } catch (error) {
    console.error("Error al crear admin:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Obtiene todos los usuarios de la base de datos
// Devuelve un JSON con los usuarios o un mensaje si no hay
// En caso de error responde con código 500
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

// Busca un usuario por su nombre recibido como parámetro
//Devuelve el usuario encontrado o error 404 si no existe
// En caso de error interno responde con 500
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

// Crea un usuario común (no necesariamente admin) con los datos recibidos
// Acá no hacemos hash
// Responde con id del usuario creado o error en caso de fallo
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


// Elimina un usuario por su id recibido como parámetro
// Devuelve mensaje de éxito o error 404 si no encontró el usuario
// En caso de error interno responde con código 500
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