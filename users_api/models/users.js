var mongoose = require('mongoose')


var userSchema = new mongoose.Schema({_id: {type: String, required: true},
                                        pass: String,
                                        numAluno: String,
                                        nome: {type: String, required: true},
                                        dataNasc: String, // dia/mes/ano
                                        sexo: String,
                                        numTelemovel: Number,
                                        curso: String,
                                        grupos: [String], // ids dos grupos a que pertence
                                        nAcess: Number,
                                       });



module.exports = mongoose.model('users', userSchema)