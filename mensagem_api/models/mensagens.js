const mongoose = require('mongoose')
var Schema = mongoose.Schema


var msgSchema = new Schema({
    texto: String,
    dataEnvio : Date,
    from: String,
    idConversa: String
  });


module.exports = mongoose.model('mensagens', msgSchema)
