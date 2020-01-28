var express = require('express');
var router = express.Router();
var Publicacoes = require('../controllers/publicacoes')

var passport = require('passport')

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

/* GET */
router.get('/:id',  passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res, next) {
    Publicacoes.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
  
});

router.get('/grupos/:id', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res, next) {
  Publicacoes.getGrupoPublicacoes(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.get('/users/:id', passport.authenticate('jwt', {session: false}),checkPermissao(0), function(req, res, next) {
  Publicacoes.getUserPublicacoes(req.params.id)
 .then(dados => res.jsonp(dados))
 .catch(erro => res.status(500).jsonp(erro))

});

router.get('/', passport.authenticate('jwt', {session: false}),checkPermissao(0), function(req, res, next) {
  Publicacoes.listar()
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.post('/', passport.authenticate('jwt', {session: false}),checkPermissao(0), function(req, res, next) {
  var newPublicacao = req.body
  newPublicacao.data = new Date() 
  Publicacoes.insert(req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

router.put('/', passport.authenticate('jwt', {session: false}),checkPermissao(0), function(req, res, next) {
  Publicacoes.update(req.body._id,req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});


router.delete('/:id', passport.authenticate('jwt', {session: false}),checkPermissao(0), function(req, res, next) {
  Publicacoes.remove(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});


module.exports = router;
