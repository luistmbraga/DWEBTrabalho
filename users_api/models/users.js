var mongoose = require('mongoose')


var userSchema = new mongoose.Schema({_id: {type: String, required: true},
                                        pass: {type:String, required: true},
                                        numAluno: {type: String, required: true},
                                        nome: {type: String, required: true},
                                        dataNasc: {type: String, required: true}, // dia/mes/ano
                                        sexo: String,
                                        numTelemovel: {type: Number, required: true},
                                        curso: {type: String, required: true},
                                        grupos: [String] // ids dos grupos a que pertence
                                       });



module.exports = mongoose.model('users', userSchema)