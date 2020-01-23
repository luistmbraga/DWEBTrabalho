var express = require('express');
var router = express.Router();

var axios = require('axios')

var apiConversas = 'http://localhost:3050/api/conversas/'
var apiMensagens = 'http://localhost:3051/api/mensagens/' 
var apiGrupos = 'http://localhost:3052/api/grupos/' 
var apiPublicacoes = 'http://localhost:3053/api/publicacoes/' 
var apiUsers = 'http://localhost:3054/api/users/'
var apiFicheiros = 'http://localhost:3055/api/ficheiros/'

var multer = require('multer')
var upload = multer({dest:'uploads/'})

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});


router.get('/mensagens/:id',function(req, res, next) {
  axios.get('http://localhost:3051/api/mensagens/'+req.params.id)
  .then( (dados) => {res.jsonp(dados.data)})
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.get('/conversas',function(req, res, next) {
var id = "a1@alunos.uminho.pt";
axios.get('http://localhost:3050/api/conversas/participante/'+id+'/simples')
  .then(dados => res.jsonp(dados.data))
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.post('/conversas',function(req, res, next) {
  axios.post('http://localhost:3050/api/conversas',req.body)
  .then( (dados) => {res.jsonp(dados.data)})
    .catch(erro => res.status(500).render('error', {error : erro}) )
})


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
            axios.get('http://localhost:3054/api/users')
              .then( (users) => {res.render('feed', {lista : dados.data, users:users.data}) 
              })
              .catch(erro => res.status(500).render('error', {error : erro}) )
        })
        .catch(erro => res.status(500).render('error', {error : erro}) )
  
})

router.post('/ficheiros/:idContainer', function(req, res, next){

  var ficheiros = {}

  // verificar na auttenticação
  ficheiros.emailUser = 'lguilhermem@hotmail.com'

  ficheiros.idContainer = req.params.idContainer
  ficheiros.ficheiro = req.ficheiros


  axios.post(apiFicheiros, ficheiros)
        .then(dados => res.jsonp(dados))
        .error(erro => res.status(500).render('error', ))
  
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

            axios.get('http://localhost:3054/api/users')
            .then( (users) => {res.render('curso', {curso: curso, dados : grupos,users:users.data})})
            .catch(erro => res.status(500).render('error', {error : erro}) ) 
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

router.post('/publicacao/:grupo', upload.array('ficheiros'), function(req, res, next){


  var newPublicacao = req.body
  
  let files = req.files;
  // ir buscar o nome do User e seu email ao token
  newPublicacao.emailUser = "lguilhermem@hotmail.com"
  newPublicacao.nomeUser = "Luís Martins"

  newPublicacao.grupo = req.params.grupo

  axios.post(apiPublicacoes, newPublicacao)
       .then( publicacao => {

        if(files.length > 0){
          
          idPublicacao = publicacao.data._id
          var ficheiros = {}
          
          // verificar na auttenticação
          ficheiros.emailUser = 'lguilhermem@hotmail.com'
        
          ficheiros.idContainer = idPublicacao
          ficheiros.ficheiro = files
        
          console.log(ficheiros)

          axios.post(apiFicheiros, ficheiros, {headers: {enctype:'multipart/form-data'}})
                .then(dados => res.redirect('/feedNoticias') )
                .error(erro => res.status(500).render('error', ))
         }
         else res.redirect('/feedNoticias') 
       })
       .catch(erro => res.status(500).render('error', {error : erro}) )

})


module.exports = router;