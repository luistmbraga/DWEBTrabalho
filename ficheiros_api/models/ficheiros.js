const mongoose = require('mongoose')
var Schema = mongoose.Schema


var FicheiroSchema = new Schema({
    size: {type: String, required: true},
    type: String,
    path: String,
    name: {type: String, required: true},
    id_container: String,
    emailUser: String
  })

  module.exports = mongoose.model('ficheiros', FicheiroSchema)
