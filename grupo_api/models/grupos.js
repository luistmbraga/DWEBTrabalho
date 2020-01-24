var mongoose = require('mongoose');
var Schema = mongoose.Schema


var GrupoSchema = new Schema({
    _id: {type: String, required: true},
    curso: {type: String, required: true},
    ano: Number,
    gruposFilhos: [String],
    desc_dependencia: Boolean 
  });

module.exports = mongoose.model('grupos',GrupoSchema)