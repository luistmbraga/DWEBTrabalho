var Ficheiro = require('../models/ficheiros')

var ObjectId = require('mongodb').ObjectID

module.exports.listar = () => {
    return Ficheiro
        .find()
        .exec()
}

module.exports.getDados = id => {
    return Ficheiro.find(ObjectId(id)).exec()
}

module.exports.inserirFicheiro = (size, mimetype, originalname, newPath, idContainer, emailUser) => {
    return new Promise((resolve, reject) => {
        
        let ficheiro = new Ficheiro({
            size: size,
            type: mimetype,
            path: newPath,
            name: originalname,
            id_container: idContainer,
            emailUser: emailUser
        });

        ficheiro.save(function(err, ficheiro){
            if(!err) {console.log('Ficheiro guardado com sucesso!'); resolve(0);}
            else console.log('ERRO:'+err)
        })
    })
    
}

module.exports.getId = path => {
    return Ficheiro.find({path: path},{_id:true}).exec()
}

module.exports.apagar = id => {
    Ficheiro.deleteOne({_id:ObjectId(id)},(err, fi) => {
        if (err) return console.error(err);
        else
        console.log(id + ' foi apagado com sucesso.')
    })
}

module.exports.getPath = id => {
    return Ficheiro.find({_id: ObjectId(id)},{_id: false, path: true}).exec()
}