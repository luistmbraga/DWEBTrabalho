var Mensagem = require('../models/mensagens')

const Mensagens = module.exports

var ObjectId = require('mongodb').ObjectID

Mensagens.listar= () =>{
  return Mensagem.find().exec()
}

Mensagens.findByConversa = (idC) => {
  return Mensagem
          .find({idConversa : idC})
          .sort({dataEnvio : 1})
          .exec()
}

Mensagens.addMensagem = (msg) => {
  var newMsg = new Mensagem(msg)
  return newMsg.save()
}
