const mongoose = require('mongoose')
var Schema = mongoose.Schema

var FicheiroSchema = new Schema({
  size: {type: String, required: true},
  type: String,
  name: {type: String, required: true},
  id_container: String,
  emailUser: String
})

var msgsSchema = new Schema({
    _id: {type: String, required: true},
    texto: String,
    dataEnvio : Date,
    from: String,
    idConversa: String
  });


var conversaSchema = new Schema({
  _id : {type: String, required: true},
  participantes : [String],
})

module.exports = mongoose.model('conversas', conversaSchema)
