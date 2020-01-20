var Conversa = require('../models/conversas')

const Conversas = module.exports

var ObjectId = require('mongodb').ObjectID

Conversas.findByConversa = (idC) => {
    return Conversa
        .find({"_id" : idC}, {"mensagens" : true})
        .sort({"dataEnvio" : 0})
        .exec()
}

Conversas.findByParticipante = (participante) => {
    return Conversa
            .find({ "participantes": { $in: [ participante ] } })
            .exec()
}

Conversas.addMensagem = (idC) => {
    return Conversa.update(
            { "_id" : idC },   
            { $push: { mensagens: msg } }
            )
            .exec()
}

Conversas.addParticipante = (idC, email) => {
    return Conversa.update({ "_id" : idC }, { $push: { participantes: email } })
            .exec()
}

Conversas.removeParticipante = (idC, email) => {
    return Conversa.update(
        { "_id" : idC},
        { $pull: { "participantes" : email } },
        { multi: true }
    )
            .exec()
}

Conversas.iniciarConversa = dados => {
    var conversa = new Conversa(dados)
    return conversa.save()
}  

