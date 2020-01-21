var express = require('express');
var router = express.Router();

var Conversas = require('../controllers/conversas')


//                                                GET

router.get('/participante/:id', function(req, res){
  Conversas.findByParticipante(req.params.id)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})


//                                                  POST

router.post('/', function(req, res){
  Conversas.iniciarConversa(req.body)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})

router.post('/:conversa/:participante', function(req, res){
  Conversas.addParticipante(req.params.conversa, req.params.participante)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})


//                                                    DELETE

router.delete('/:conversa/:participante', function(req, res){
  Conversas.removeParticipante(req.params.conversa, req.params.participante)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})



module.exports = router;
