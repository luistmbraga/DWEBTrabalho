var express = require('express');
var router = express.Router();

var Mensagens = require('../controllers/mensagens')

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

router.get('/', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res){
  Mensagens.listar()
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro))
})

router.get('/:conversa', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res){
  Mensagens.findByConversa(req.params.conversa)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})

router.post('/', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res){
  var msg = req.body
  msg.dataEnvio = new Date()
  Mensagens.addMensagem(msg)
            .then( () => res.jsonp({Result:"Message inserted"}))
            .catch(erro => res.status(500).jsonp(erro))
})

module.exports = router;