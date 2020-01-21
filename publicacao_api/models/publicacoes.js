var mongoose = require('mongoose');
var Schema = mongoose.Schema



var PublicacaoSchema = new Schema({
  data: Date,
  conteudo: String,
  emailUser: String,
  nomeUser: String,
  grupo: String,
  tags: [String]
})

module.exports = mongoose.model('publicacoes',PublicacaoSchema)