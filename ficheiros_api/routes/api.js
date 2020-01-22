var express = require('express');
var router = express.Router();
var Ficheiros = require('../controllers/ficheiros')
const fs = require('fs')
var multer = require('multer')
var upload = multer({dest: 'uploads/'})
var mkdirp = require('mkdirp');
var md5 = require('md5');


router.get('/ficheiros/:idFicheiro', function(req, res) {
  Ficheiros.getDados(req.params.idFicheiro)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

/* GET users listing. */
router.get('/ficheiros', function(req, res) {
  Ficheiros.listar()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});



router.get('/download/:idFicheiro', function(req, res){

  Ficheiros.getPath(req.params.idFicheiro)
    .then(dados => {
      

      res.download(dados[0].path)


    })
    .catch(erro => res.status(500).jsonp(erro))

  
})

// Inserir um ficheiro na pasta de grupos
router.post('/ficheiros', upload.array('ficheiro'), function(req, res){

  var length = req.files.length;
  
  for(var i = 0; i < length; i++){

    let oldPath = __dirname + '/../'+req.files[i].path
    let newPath = __dirname + '/../public/ficheiros/'
    let name = req.files[i].originalname
    let size = req.files[i].size
    let type = req.files[i].mimetype

  

    fs.readFile(oldPath, function(err, buf) {
      var string = md5(buf);
      var string1 = string.substring(0, 8);
      var string2 = string.substring(8, 16);
      var string3 = string.substring(16, 24);
      var string4 = string.substring(24, 32);
      
      newPath = newPath + string1 + '/' + string2 + '/' + string3 + '/' + string4 + '/';
      mkdirp(newPath);

      newPath = newPath + name;

      fs.rename(oldPath, newPath, function(err){
        if(err) throw err
      })

      Ficheiros.inserirFicheiro(size, type, name, newPath, req.body.idContainer, req.body.emailUser)
    });
  
    
  }

  res.end('0');
})



router.delete('/ficheiros/:idFicheiro', function(req, res){

  Ficheiros.getPath(req.params.idFicheiro)
    .then(dados => {
      

      Ficheiros.apagar(req.params.idFicheiro);

      fs.unlinkSync(dados[0].path , (err) => {
        if (err) {
          console.error(err)
        }
      
        //file removed
      })

      res.end('0');
    })
    .catch(erro => res.status(500).jsonp(erro))
  
})

module.exports = router;
