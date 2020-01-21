var express = require('express');
var router = express.Router();
var Ficheiros = require('../controllers/ficheiros')
const fs = require('fs')
var multer = require('multer')
var upload = multer({dest: 'uploads/'})


/* GET users listing. */
router.get('/ficheiros', function(req, res) {
  Ficheiros.listar()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/download/:fnome', function(req, res){
  res.download(__dirname + '/../public/ficheiros/'+req.params.fnome)
})

router.post('/ficheiros', upload.array('ficheiro'), function(req, res){


  var length = req.files.length;
  
  for(var i = 0; i < length; i++){

    let oldPath = __dirname + '/../'+req.files[i].path
    let newPath = __dirname + '/../public/ficheiros/'+req.files[i].originalname

    fs.rename(oldPath, newPath, function(err){
      if(err) throw err
    })

    console.log(oldPath)

    Ficheiros.inserirFicheiro(req.files[i], newPath, req.body.idContainer, req.body.emailUser)

  }

  res.end('0');
})

router.delete('/ficheiros/:idFicheiro/:name', function(req, res){

  // apaga na base de dados
  Ficheiros.apagar(req.params.idFicheiro);
  
  // apaga o ficheiro
  fs.unlinkSync(__dirname + '/../public/ficheiros/' + req.params.name, (err) => {
    if (err) {
      console.error(err)
    }
  
    //file removed
  })
  res.end('0');
})


module.exports = router;
