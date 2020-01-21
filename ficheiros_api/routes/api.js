var express = require('express');
var router = express.Router();
var Ficheiros = require('../controllers/ficheiros')
const fs = require('fs')
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var mkdirp = require('mkdirp');

/* GET users listing. */
router.get('/ficheiros', function(req, res) {
  Ficheiros.listar()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/download/:fnome', function(req, res){
  res.download(__dirname + '/../public/ficheiros/'+req.params.fnome)
})

// Inserir um ficheiro na pasta de grupos
router.post('/ficheirosGrupos', upload.array('ficheiro'), function(req, res){

  var length = req.files.length;
  
  for(var i = 0; i < length; i++){

    let oldPath = __dirname + '/../'+req.files[i].path
    let newPath = __dirname + '/../public/ficheiros/Grupos/'+ req.body.idContainer 

    
    mkdirp(newPath)

    newPath = newPath + req.files[i].originalname;

    
    fs.rename(oldPath, newPath, function(err){
      if(err) throw err
    })


    Ficheiros.inserirFicheiro(req.files[i], newPath, req.body.idContainer, req.body.emailUser)
    
  }

  res.end('0');
})

// Inserir um ficheiro na pasta de conversas
router.post('/ficheirosConversas', upload.array('ficheiro'), function(req, res){

  var length = req.files.length;
  
  for(var i = 0; i < length; i++){

    let oldPath = __dirname + '/../'+req.files[i].path
    let newPath = __dirname + '/../public/ficheiros/Conversas/'+ req.body.idContainer 

    // fazer pedido ao grupos
    
    mkdirp(newPath)

    newPath = newPath + req.files[i].originalname;

    
    fs.rename(oldPath, newPath, function(err){
      if(err) throw err
    })


    Ficheiros.inserirFicheiro(req.files[i], newPath, req.body.idContainer, req.body.emailUser)
    
  }

  res.end('0');
})

router.delete('/ficheirosGrupos/:idFicheiro/:idContainer', function(req, res){

  // apaga na base de dados
  Ficheiros.apagar(req.params.idFicheiro);

  // fazer request ao grupos

  console.log(req.body)
  // apaga o ficheiro
  fs.unlinkSync(__dirname + '/../public/ficheiros/Grupos/' , (err) => {
    if (err) {
      console.error(err)
    }
  
    //file removed
  })
  res.end('0');
})

module.exports = router;
