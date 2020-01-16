var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')


router.get('/user', function(req, res) {
  Users.listarTodosUsers()
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/user/:id', function(req, res) {
  Users.consultarUserId(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.get('/user/:id/grupos', function(req, res) {
  Users.gruposUserId(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/user/:id', function(req, res){
  Users.apagarUser(req.params.id);
  res.end('0');
})

router.post('/user', function(req, res){
  
  Users.inserirUser(req.body);
  res.end('0');
})

router.put('/user/:id', function(req, res){
  
  Users.atualizarUser(req.params.id, req.body);
  console.log('User: ' + req.params.id + ' atualizado');
  res.end('0');
})

router.put('/user/:id/:idgrupo', function(req, res){

  Users.insereGrupoUser(req.params.id, req.params.idgrupo);
  console.log('Grupo atualizado');
  res.end('0');
})

module.exports = router;
