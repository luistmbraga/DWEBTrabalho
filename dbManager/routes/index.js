var express = require('express');
var router = express.Router();

var fs = require('fs')
var jsonfile = require('jsonfile')
var mongoose = require('mongoose')
var GenerateSchema = require('generate-schema')
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
var passport = require('passport')

var dbName = 'UMbook'

var validCollections = [
    "conversas",
    "users",
    "grupos",
    "publicacoes",
    "ficheiros",
    "mensagens"
]


function checkPermissao(acess){
  return function(req, res, next) {
  if(acess == 0 || req.user.nAcess>=acess){
    console.log("Tem permissão")
    next()
  }
  else{
  console.log("Não tem permissão")
  res.status(401).jsonp("Não tem permissão")
  }
  }
}

router.get('/export', passport.authenticate('jwt', {session: false}),checkPermissao(3),function(req, res){
    getFile()
      .then( schema => {

        fs.writeFile('UMbook.json', JSON.stringify(schema, null, 5), function(erro) {
            if (erro) res.status(500).jsonp(erro)
            res.download(__dirname + '/../UMbook.json', function(erro){
              if(!erro){
                fs.unlinkSync('UMbook.json', (err)=>{
                  if(err) {
                    console.log(err)
                  }
                })
              }
            })
        })
      })
      .catch(erro => res.jsonp(erro))
})

function getFile(){
  return new Promise(function(resolve, reject) {
    MongoClient.connect(url, {useUnifiedTopology: true})
              .then(db => {
                  var dbo = db.db('UMbook')
                  dbo.collections()
                     .then(collections =>{
                        exportaDados(collections)
                        .then(schema => {
                            db.close()
                              .then(() => resolve(schema) )
                              .catch(erro => reject(new Error(erro)))
                        })
                        .catch(error => reject(new Error(error)))
                    })
                    .catch(error => reject(new Error(error)))
                  })
              .catch(erro => reject(new Error(erro)))
    })
}

function exportaDados(collections){
  return new Promise(function(resolve, reject) {
      var schema = {}
      var length = collections.length - 1
      var i = 0
      collections.forEach(collection =>{
          collection.find({}).toArray(function(err, result) {
              if (err) reject(new Error(err));
              
              schema[collection.collectionName] = result;  
                    
              if(i++ == length) resolve(schema)
          })
      })
  })
}



router.post('/import', passport.authenticate('jwt', {session: false}),checkPermissao(3),upload.single('json'), function(req, res){
  let path = __dirname + '/../'+req.file.path
  parseFile(req.file)
    .then( () => {
      res.jsonp("Povoado com sucesso")
    })
    .catch(erro => res.jsonp(erro))
    .finally(() => {
      fs.unlinkSync(path , (err) => {
        if (err) {
          res.jsonp(err)
        }
      })
    })
})

function parseFile(file) {
  return new Promise((resolve, reject) => {
      let path = __dirname + '/../'+file.path
      mongoose.connect(url+dbName, {useNewUrlParser:true, useUnifiedTopology: true} )
                        .then(connection => {
                                jsonfile.readFile(path, (erro, schema)=>{

                                    if (erro) return console.log(erro)
                                    var collections = Object.keys(schema)
                                    
                                    createCollections(schema, collections)
                                                    .then(() => resolve(path))
                                                    .catch(error => reject(new Error(error)))
                                                    .finally( () => connection.disconnect())
                                })
                        })
                        .catch((erro)=> reject(new Error('Mongo - erro na conexão: ' + erro )))
  })
}


function createCollections(json, collectionsNames){
  return new Promise(function(resolve, reject){
      var i = 0;
      var length = collectionsNames.length -1
      if (length == -1) reject(new Error("Não existe collections/objetos para importar!"))
      collectionsNames.forEach(collectionName => {
          if(validCollections.includes(collectionName)){
              var conteudo = json[collectionName]
              var schema = GenerateSchema.json(collectionName, conteudo);

              model = mongoose.model(collectionName, new mongoose.Schema (schema.items.properties))

              model.insertMany(conteudo)
              .then(() => {
                  delete mongoose.connection.models[collectionName]
                  console.log('Foram inseridos ' + conteudo.length + ' documentos na collection ' + collectionName + '!' );
                  if(i++ == length) resolve('Dados importados!') 
              })
              .catch(() => {
                delete mongoose.connection.models[collectionName]
                reject(new Error("Tem dados que já se encontram na BD!"))
              })
              .finally(() => {
              })
          }
          else if(i++ == length) resolve('Dados importados!')
      })
  })
}


router.delete('/drop', passport.authenticate('jwt', {session: false}),checkPermissao(3),function(req, res){
    MongoClient.connect(url, {useUnifiedTopology: true})
              .then(db => {
                  var dbo = db.db('UMbook')
                  dbo.dropDatabase()
                     .then(() =>{res.jsonp("WARNING: DATABASE ELIMINADA")})
              })
              .catch(erro => console.log(erro))
})

module.exports = router;
