var express = require('express');
var router = express.Router();
var Ficheiros = require('../controllers/ficheiros')
const fs = require('fs')
var multer = require('multer')
var upload = multer({dest: 'uploads/'})

var md5 = require('md5');
const mkdirp = require('mkdirp-promise')

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


router.get('/ficheiros/publicacao/:idContainer', function(req, res){
  Ficheiros.getInfoPublicacoes(req.params.idContainer)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
})


router.get('/download/:idFicheiro', function(req, res){

  Ficheiros.getPath(req.params.idFicheiro)
    .then(dados => {
      console.log(dados[0].path)

      //res.download(dados[0].path)


    })
    .catch(erro => res.status(500).jsonp(erro))

  
})



function addFiles(files, body) {
  return new Promise((resolve, reject) => {
    
    var ids = [];
    var length = files.length - 1
    for(var i = j = 0; i <= length; i++){

      let oldPath = __dirname + '/../'+files[i].path
      let newPath = __dirname + '/../public/ficheiros/'
      let name = files[i].originalname
      let size = files[i].size
      let type = files[i].mimetype
  
  
      fs.readFile(oldPath, function(err, buf) {
        var string = md5(buf);
        var string1 = string.substring(0, 8);
        var string2 = string.substring(8, 16);
        var string3 = string.substring(16, 24);
        var string4 = string.substring(24, 32);
        
        newPath = newPath + string1 + '/' + string2 + '/' + string3 + '/' + string4 + '/';

        mkdirp(newPath)
          .then(dados => {
            newPath = newPath + name;
  
            fs.rename(oldPath, newPath, function(err){
              if(err) throw err
            })
      
            
            Ficheiros.inserirFicheiro(size, type, name, newPath, body.idContainer, body.emailUser)
              .then(id => {
                   
                ids.push(id); 
                
                if(j++ == length) resolve(ids);
                  
              })
              .catch(erro => res.status(500).jsonp(erro))
          })
          .catch(erro => res.status(500).jsonp(erro))
  
        
  
      });
     
    }
      
  });
}

// Inserir um ficheiro na pasta de grupos
router.post('/ficheiros', upload.array('ficheiro'), function(req, res){
  //console.log(req.files)
  console.log(req.body)
  addFiles(req.files, req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))

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
