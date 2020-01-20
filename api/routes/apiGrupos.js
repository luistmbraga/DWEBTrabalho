var express = require('express');
var router = express.Router();
var Grupos = require('../controllers/grupos')

/* GET home page. */
router.get('/:id', function(req, res, next) {
    Grupos.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
  
});

router.delete('/:id', function(req, res, next) {
  Grupos.remover(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.get('/:id/publicacoes', function(req, res, next) {
   Grupos.getPublicacoes(req.params.id)
   .then(dados => res.jsonp(dados))
   .catch(erro => res.status(500).jsonp(erro))
 
});

router.put('/:id/publicacao', function(req, res, next) {
  Grupos.editPublicacao(req.params.id,req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.get('/:id/users', function(req, res, next) {
  Grupos.getUsers(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.get('/:id/files', function(req, res, next) {
  Grupos.getFiles(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.get('/:id/subgrupos', function(req, res, next) {
  Grupos.getGrupos(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});



router.post('/', function(req, res, next) {
  Grupos.addGrupo(req.body)
  res.end('0');
});

router.put('/', function(req, res, next) {
  console.log(req.body)
  Grupos.updateGrupo(req.body._id,req.body)
  res.end('0');
});

module.exports = router;
