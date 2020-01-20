var Grupo = require('../models/grupos')

const Grupos = module.exports

Grupos.listar = () =>{
    return Grupo
        .find()
        .exec()
}

Grupos.consultar = id =>{
    return Grupo
        .findOne({_id:id})
        .exec()
}

Grupos.contar = () =>{
    return Grupo
    .countDocuments()
    .exec()
}

Grupos.projectar = campos =>{
    return Grupo
    .find({}, campos)
    .exec()
}

Grupos.getPublicacoes = (id) =>{
    return Grupo
        .find({_id:id},{"publicacoes":true,"_id":false})
        .exec()
}

Grupos.getUsers = (id) =>{
    return Grupo
        .find({_id:id},{"email":true,"_id":false})
        .exec()
}

Grupos.getFiles = (id) =>{
    return Grupo
        .find({_id:id},{"ficheiros":true,"_id":false})
        .exec()
}

Grupos.getGrupos = (id) =>{
    return Grupo
        .find({_id:id},{"gruposFilhos":true,"_id":false})
        .exec()
}

Grupos.addSubGrupo = (id,g) =>{
    return Grupo.findOneAndUpdate(
        {  _id: id},
        { $push: {gruposFilhos: g }}
    );
}

Grupos.removeSubGrupo = (id,gId) =>{
    return Grupo.findOneAndUpdate(
        {  _id: id},
        { $pop: {gruposFilhos: gId} }
    );
}

Grupos.addPublicacao = (id,pub) =>{
    return Grupo.findOneAndUpdate(
        {  _id: id},
        { $push: {publicacoes: pub }}
    );
}

Grupos.editPublicacao = (id,pub) =>{
    return Grupo.updateOne(
        {  _id: id, "publicacoes._id":pub._id },
        { "publicacoes.$.conteudo": pub.conteudo})
}

Grupos.removePublicacao = (grupoId,pubId) =>{
    return Grupo.findOneAndUpdate(
        {  _id: grupoId},
        { $pop: {publicacoes: pubId} }
    );
}

Grupos.addFicheiro = (id,ficheiro) =>{
    return Grupo.findOneAndUpdate(
        {  _id: id},
        { $push: {ficheiros: ficheiro}}
    );
}

Grupos.removeFicheiro = (id,ficheiroId) =>{
    return Grupo.findOneAndUpdate(
        {  _id: id},
        { $pop: {ficheiros: ficheiroId }}
    );
}

Grupos.updateGrupo = (id,newgrupo) =>{
    return Grupo
        .updateOne({_id: id}, {$set: newgrupo})
        .exec()
}

Grupos.addGrupo = (g) =>{
    console.log(g)
    var grupo = new Grupo(g);
    grupo.save(function (err, grupo) {
        if (err) console.log(err);
        else
        return console.log(grupo._id + ' foi gravado com sucesso.')
    })
}

Grupos.remover= (id) =>{
    Grupo.deleteOne({_id:id}, function (err) {
        if(err) 
            console.error(err)
        else
            console.log("Grupo apagado com sucesso!") 

    });
}









////// EXEMPLOS //////////////////

Grupos.pubsByType = type =>{
    return Grupo
        .find({type:type})
        .exec()
}


Grupos.pubsByTypeAndYear = (type,year) =>{
    return Grupo
    .find({"type":type, "year":{ $gt: year }})
    .exec()

}

Grupos.autoresOrd = () =>{
    return Grupo
    .aggregate([{$unwind:"$authors"},{$group:{_id:"$authors"}},{$sort:{"_id":1}}])
    .exec()
}

Grupos.AutorPubs = author =>{
    return Grupo
        .find({"authors": {$in:[author]}})
        .exec()
}
