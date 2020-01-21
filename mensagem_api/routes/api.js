var express = require('express');
var router = express.Router();

var Mensagens = require('../controllers/mensagens')


router.get('/:conversa', function(req, res){
  Mensagens.findByConversa(req.params.conversa)
          .then(dados => res.jsonp(dados))
          .catch(erro => res.status(500).jsonp(erro))
})

router.post('/', function(req, res){
  var msg = new(req.body)
  msg.dataEnvio = new Date()
  Mensagens.addMensagem(msg)
            .then( () => res.jsonp({Result:"Message inserted"}))
            .catch(erro => res.status(500).jsonp(erro))
})

module.exports = router;