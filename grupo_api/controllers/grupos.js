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

Grupos.getGruposFilhos = (id) =>{
    return Grupo
        .find({_id:id},{"gruposFilhos":true,"_id":false})
        .exec()
}

Grupos.update = (id,newgrupo) =>{
    return Grupo
        .updateOne({_id: id}, {$set: newgrupo})
        .exec()
}

Grupos.insert = (g) =>{
    var grupo = new Grupo(g);
    return grupo.save()
}

Grupos.remove= (id) =>{
    return Grupo.deleteOne({_id:id})
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
