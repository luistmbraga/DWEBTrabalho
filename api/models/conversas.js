const mongoose = require('mongoose')
var Schema = mongoose.Schema

var FicheiroSchema = new Schema({
  _id: {type: String, required: true},
  size: {type: String, required: true},
  type: String,
  name: {type: String, required: true}
})

var msgsSchema = new Schema({
    _id: {type: String, required: true},
    texto: String,
    ficheiros: [FicheiroSchema],
    dataEnvio : Date,
    from: String
  });


var conversaSchema = new Schema({
  _id : {type: String, required: true},
  participantes : [String],
  mensagens : [msgsSchema]
})

module.exports = mongoose.model('conversas', conversaSchema)
