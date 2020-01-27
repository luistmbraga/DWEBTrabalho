var express = require('express');
var router = express.Router();
var Users = require('../controllers/users')
var passport = require('passport')
var crypto = require('crypto');

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

router.get('/', passport.authenticate('jwt', {session: false}),checkPermissao(0),function(req, res) {
  console.log(req.user)  
  Users.listarTodosUsers()
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro))
  });
  
  router.get('/:id', passport.authenticate('jwt', {session: false}), function(req, res) {
    Users.consultarUserId(req.params.id)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro))
  });
  

  router.get('/:id/grupos', passport.authenticate('jwt', {session: false}),checkPermissao(1), function(req, res) {
    Users.gruposUserId(req.params.id)
      .then(dados => res.jsonp(dados))
      .catch(erro => res.status(500).jsonp(erro))
  });
  
  router.delete('/:id', passport.authenticate('jwt', {session: false}),checkPermissao(3), function(req, res){
    Users.apagarUser(req.params.id);
    res.end('0');
  })
  
  router.post('/', function(req, res){ //passport.authenticate('jwt', {session: false})
    req.body.nAcess = -1;
    console.log("yey")
    var token = crypto.randomBytes(16).toString('hex');
    console.log("wow")
    console.log("token")
    req.body.token = token;
    
    Users.inserirUser(req.body)
    .then(dados => res.jsonp(dados))
    .catch(erro => {console.log(erro);res.status(500).jsonp(erro)})
  })
  
  router.put('/:id', passport.authenticate('jwt', {session: false}),checkPermissao(3),function(req, res){
    Users.atualizarUser(req.params.id, req.body);
    console.log('User: ' + req.params.id + ' atualizado');
    res.end('0');
  })
  
  router.put('/:id/:idgrupo', passport.authenticate('jwt', {session: false}),checkPermissao(3), function(req, res){
  
    Users.insereGrupoUser(req.params.id, req.params.idgrupo);
    console.log('Grupo atualizado');
    res.end('0');
  })

  module.exports = router;
