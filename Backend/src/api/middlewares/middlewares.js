let verifyID = (req, res, next) =>{
    let {id} = req.params;
    if(!id || isNaN(id)){
        res.status(400).json({message: "Error con el formato del id"});
    }
    next()
}

let verifyBody = (req, res, next) => {
    let body = req.params;
    console.log(body.length);
    next()
}

export {
    verifyID,
    verifyBody
}