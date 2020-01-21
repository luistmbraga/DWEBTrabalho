var express = require('express');
var router = express.Router();

var axios = require('axios')
var api = 'http://localhost:4545/api/'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// Página inicial após autenticação
router.get('/inicial', function(req, res, next) {
  res.render('index');
});

// Desnecessário
router.get('/registo', function(req, res, next){
  res.render('registo')
})


router.get('/logout', function(req, res){
  res.redirect('/')
})

router.get('/feedNoticias', function(req, res, next){
  /*
  axios.get(api + "grupos/principal")
        .then(dados => res.render('feed', {lista : dados.data}))
        .catch(erro => res.status(500).render('erro', {error : erro}) )
        */
  var teste = []
  var publicacao = {}
  publicacao.utilizador = "Braga Men"
  publicacao.texto = "SOU GAYYYYYY"
  teste.push(publicacao)
  var publicacao2 = {}
  publicacao2.utilizador = "Braga Men"
  publicacao2.texto = "Queria chupar a piça do Luisinho"
  teste.push(publicacao2)
  res.render('feed', {lista:teste, amigos:[]} )
})





router.post('/publicacao/:id', function(req, res, next){
  var grupo = req.params.id
  axios.post(api + 'grupos/' + grupo)
       .catch(erro => res.status(500).render('error', {error : erro}))
})

router.post('/login', function(req, res, next) {
  var email = req.body.email
  var password = req.body.password

  res.redirect('/feedNoticias')
})

router.post('/utilizador', function(req, res, next){
  var newUser = req.body
  axios.post(api + "utilizador", newUser)
       .then( () => res.redirect('/') )
       .catch(erro => res.status(500).render('erro', {error : erro}) )
})

router.post('/teste', function(req, res, next){
  console.log(res)
  axios.post('http://localhost:5019/download/Postman.exe',JSON.stringify(res))
       .then( () => res.redirect('/') )
       .catch(erro => res.status(500).render('erro', {error : erro}) )
})




module.exports = router;