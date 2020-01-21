var Publicacao = require('../models/publicacoes')

const Publicacoes = module.exports

Publicacoes.listar = () =>{
    return Publicacao
        .find()
        .exec()
}

Publicacoes.consultar = id =>{
    return Publicacao
        .findOne({_id:id})
        .exec()
}

Publicacoes.contar = () =>{
    return Publicacao
    .countDocuments()
    .exec()
}

Publicacoes.projectar = campos =>{
    return Publicacao
    .find({}, campos)
    .exec()
}

Publicacoes.update = (id,newP) =>{
    return Publicacao
        .updateOne({_id: id}, {$set: newP})
        .exec()
}

Publicacoes.insert = (p) =>{
    var pub = new Publicacao(p);
    return pub.save();
}

Publicacoes.remove= (id) =>{
    return Publicacao.deleteOne({_id:id})
}

Publicacoes.getUserPublicacoes = (email) =>{
    return Publicacao
        .find({emailUser:email})
        .exec()
}

Publicacoes.getGrupoPublicacoes = (nome) =>{
    return Publicacao
        .find({grupo:nome})
        .exec()
}