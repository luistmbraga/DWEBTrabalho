var mongoose = require('mongoose');
var Schema = mongoose.Schema


var FicheiroSchema = new Schema({
    size: {type: String, required: true},
    type: String,
    name: {type: String, required: true}
})


var PublicacaoSchema = new Schema({
  data: Date,
  conteudo: String,
  emailUser: String,
  nomeUser: String,
  ficheiros: [FicheiroSchema],
  tags: [String]
})

var GrupoSchema = new Schema({
    _id: {type: String, required: true},
    curso: {type: String, required: true},
    gruposFilhos: [String],
    desc_dependencia: Boolean 
  });

module.exports = mongoose.model('grupos',GrupoSchema)