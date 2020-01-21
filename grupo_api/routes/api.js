var express = require('express');
var router = express.Router();
var Grupos = require('../controllers/grupos')

/* GET home page. */
router.get('/:id', function(req, res, next) {
    Grupos.consultar(req.params.id)
    .then(dados => res.jsonp(dados))
    .catch(erro => res.status(500).jsonp(erro))
  
});

router.get('/', function(req, res, next) {
  Grupos.listar()
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});


router.get('/subgrupos/:id', function(req, res, next) {
  Grupos.getGruposFilhos(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});

router.post('/', function(req, res, next) {
  Grupos.insert(req.body)
  .then(()=> res.jsonp({result:"Grupo inserido com sucesso!"}))
  .catch(erro => res.status(500).jsonp(erro))
});

router.put('/', function(req, res, next) {
  Grupos.update(req.body._id,req.body)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))
});

router.delete('/:id', function(req, res, next) {
  Grupos.remove(req.params.id)
  .then(dados => res.jsonp(dados))
  .catch(erro => res.status(500).jsonp(erro))

});


module.exports = router;
