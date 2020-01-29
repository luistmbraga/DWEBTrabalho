var mongoose = require('mongoose');
var Schema = mongoose.Schema


var GrupoSchema = new Schema({
    _id: {type: String, required: true},
    curso:  String,
    gruposFilhos: [String],
    desc_dependencia: Boolean 
  });

module.exports = mongoose.model('grupos',GrupoSchema)