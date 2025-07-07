let verifyID = (req, res, next) =>{
    let {id} = req.params;
    if(!id || isNaN(id)){
        res.status(400).json({message: "Error con el formato del id"});
    }
    next()
}

export {
    verifyID
}