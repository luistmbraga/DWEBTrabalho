var express = require('express');
var router = express.Router();
var Grupos = require('../controllers/grupos')

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

/* GET home page. */
router.get('/:id', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res, next) {
    Grupos.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
  
});

router.get('/', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res, next) {
  Grupos.listar()
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});


router.get('/subgrupos/:id', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res, next) {
  Grupos.getGruposFilhos(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.post('/', passport.authenticate('jwt', {session: false}),checkPermissao(1),function(req, res, next) {
  Grupos.insert(req.body)
  .then(()=> res.jsonp({result:"Grupo inserido com sucesso!"}))
  .catch(erro => res.status(500).jsonp(erro))
});

router.put('/', passport.authenticate('jwt', {session: false}),checkPermissao(1),function(req, res, next) {
  Grupos.update(req.body._id,req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/:id', passport.authenticate('jwt', {session: false}),checkPermissao(3),function(req, res, next) {
  Grupos.remove(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});


module.exports = router;
