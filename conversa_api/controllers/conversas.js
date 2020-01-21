var Conversa = require('../models/conversas')

const Conversas = module.exports

var ObjectId = require('mongodb').ObjectID
    
Conversas.findByParticipante = (participante) => {
    return Conversa
            .find({ "participantes": { $in: [ participante ] } })
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

