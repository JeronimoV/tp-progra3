// Middleware logger global
const loggerUrl = (req, res, next) => {
    console.log(`[${new Date().toLocaleString()}] ${req.method} ${req.url}`);
    next();
};

// Middleware para validar id
let verifyID = (req, res, next) => {
    let { id } = req.params;
    if (!id || isNaN(id)) {
        return res.status(400).json({ message: "Error con el formato del id" });
    }
    req.id = parseInt(id, 10);
    next();
};


let verifyBody = (req, res, next) => {
    let body = req.body; 
    if (!body || Object.keys(body).length === 0) {
        return res.status(400).json({ message: "El cuerpo de la solicitud está vacío" });
    }
    next();
};

export {
    loggerUrl,
    verifyID,
    verifyBody
};

//loggerUrl: Middleware global que registra en consola la fecha, método y URL de cada solicitud entrante.
//verifyID: Valida que el parámetro id exista y sea un número válido; si no, responde con error 400. Además, convierte el id a entero para uso posterior.
//verifyBody: Verifica que el cuerpo de la solicitud (req.body) no esté vacío; si lo está, responde con error 400.