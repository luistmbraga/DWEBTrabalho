var express = require('express');

var router = express.Router();

var Conversas = require('../controllers/conversas')



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

//GET

router.get('/', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req,res){
  Conversas.listar()
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})

router.get('/participante/:id', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res){
  Conversas.findByParticipante(req.params.id)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})

router.get('/participante/:id/simples', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res){
  Conversas.findByParticipanteSimple(req.params.id)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})


//                                                  POST

router.post('/', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res){
  Conversas.iniciarConversa(req.body)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})

router.post('/:conversa/:participante', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res){
  Conversas.addParticipante(req.params.conversa, req.params.participante)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})


//                                                    DELETE

router.delete('/:conversa/:participante', passport.authenticate('jwt', {session: false}),checkPermissao(2),function(req, res){
  Conversas.removeParticipante(req.params.conversa, req.params.participante)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})



module.exports = router;
