var express = require('express');
var router = express.Router();
var Publicacoes = require('../controllers/publicacoes')

/* GET */
router.get('/:id', function(req, res, next) {
    Publicacoes.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
  
});

router.get('/grupos/:id', function(req, res, next) {
  Publicacoes.getGrupoPublicacoes(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.get('/users/:id', function(req, res, next) {
  Publicacoes.getUserPublicacoes(req.params.id)
 .then(dados => res.jsonp(dados))
 .catch(erro => res.status(500).jsonp(erro))

});

router.get('/', function(req, res, next) {
  Publicacoes.listar()
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.post('/', function(req, res, next) {
  var newPublicacao = req.body
  newPublicacao.data = new Date() 
  Publicacoes.insert(req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

router.put('/', function(req, res, next) {
  Publicacoes.update(req.body._id,req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});


router.delete('/:id', function(req, res, next) {
  Publicacoes.remove(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});


module.exports = router;
