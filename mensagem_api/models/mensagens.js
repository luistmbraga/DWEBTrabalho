const mongoose = require('mongoose')
var Schema = mongoose.Schema


var msgSchema = new Schema({
    texto: {type: String, required:true},
    dataEnvio : {type: Date, required:true},
    from: {type: String, required:true},
    idConversa: {type: String, required:true}
  });


module.exports = mongoose.model('mensagens', msgSchema)
