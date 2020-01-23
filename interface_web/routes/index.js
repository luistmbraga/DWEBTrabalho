var express = require('express');
var router = express.Router();

var axios = require('axios')

var apiConversas = 'http://localhost:3050/api/conversas/'
var apiMensagens = 'http://localhost:3051/api/mensagens/' 
var apiGrupos = 'http://localhost:3052/api/grupos/' 
var apiPublicacoes = 'http://localhost:3053/api/publicacoes/' 
var apiUsers = 'http://localhost:3054/api/users/'

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
  axios.get(apiPublicacoes + "grupos/principal")
        .then(dados => { 
            dados.data.forEach(element => {
              dataFormatada = new Date(element.data)
              element.data = dataFormatada.toDateString()
            });
              
            res.render('feed', {lista : dados.data}) 
          })
        .catch(erro => res.status(500).render('error', {error : erro}) )
  
})

function subgrupos(dados){
  return new Promise( (resolve, reject) => {
    var length = dados.length
    var i = 0
    grupos = []
    dados.forEach(grupo =>{
      grupos[grupo] = []
      axios.get(apiGrupos + 'subgrupos/' + grupo)
             .then(ucs =>{
                 if(ucs.data[0].gruposFilhos.length != 0){
                    grupos[grupo] = ucs.data[0].gruposFilhos
                 }
                 if (++i == length) resolve(grupos)
             })
             .catch(erro => reject(erro))
    })
  })
  
}



// Eventualmente, melhorar 
router.get('/grupos', function(req, res, next){
  // depois ir à sessão
  var curso ="MIEI"
  axios.get(apiGrupos + 'subgrupos/' + curso)
       .then(dados => {
         
         //console.log(dados.data)
         
         subgrupos(dados.data[0].gruposFilhos).then(grupos =>{
            console.log(grupos)
            res.render('curso', {curso: curso, dados : grupos})
         }) 

        })
       .catch(erro => res.status(500).render('error', {error : erro}) )

})


router.post('/login', function(req, res, next) {
  var email = req.body.email
  var password = req.body.password

  res.redirect('/feedNoticias')
})

router.post('/utilizador', function(req, res, next){
  var newUser = req.body
  newUser.grupos = []
  axios.post(apiUsers, newUser)
       .then( () => res.redirect('/') )
       .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.post('/publicacao/:grupo', function(req, res, next){

  var newPublicacao = req.body
  
  // ir buscar o nome do User e seu email ao token
  newPublicacao.emailUser = "lguilhermem@hotmail.com"
  newPublicacao.nomeUser = "Luís Martins"

  newPublicacao.grupo = req.params.grupo

  axios.post(apiPublicacoes, newPublicacao)
       .then( () => res.redirect('/feedNoticias') )
       .catch(erro => res.status(500).render('error', {error : erro}) )

})


module.exports = router;