const mongoose = require('mongoose')
var Schema = mongoose.Schema


var conversaSchema = new Schema({
  participantes : [String]
})

module.exports = mongoose.model('conversas', conversaSchema)
