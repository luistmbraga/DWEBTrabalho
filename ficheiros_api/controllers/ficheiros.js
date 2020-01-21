var Ficheiro = require('../models/ficheiros')

var ObjectId = require('mongodb').ObjectID

module.exports.listar = () => {
    return Ficheiro
        .find()
        .exec()
}

module.exports.inserirFicheiro = (file, newPath, idContainer, emailUser) => {
    let ficheiro = new Ficheiro({
        size: file.size,
        type: file.mimetype,
        path: newPath,
        name: file.originalname,
        id_container: idContainer,
        emailUser: emailUser
    });

    ficheiro.save(function(err, ficheiro){
        if(!err) console.log('Ficheiro guardado com sucesso!')
        else console.log('ERRO:'+err)

      })


}


module.exports.apagar = id => {
    Ficheiro.deleteOne({_id:ObjectId(id)},(err, fi) => {
        if (err) return console.error(err);
        else
        console.log(id + ' foi apagado com sucesso.')
    })
}

