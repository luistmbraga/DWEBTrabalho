var Mensagem = require('../models/mensagens')

const Mensagens = module.exports

var ObjectId = require('mongodb').ObjectID


Mensagens.findByConversa = (idC) => {
  return Mensagem
          .find({idConversa : idC})
          .sort({dataEnvio : 0})
          .exec()
}

Mensagens.addMensagem = (msg) => {
  var newMsg = new Mensagem(msg)
  return newMsg.save()
}
