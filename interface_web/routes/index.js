var express = require('express');
var router = express.Router();

var axios = require('axios')

var apiConversas = 'http://localhost:3050/api/conversas/'
var apiMensagens = 'http://localhost:3051/api/mensagens/' 
var apiGrupos = 'http://localhost:3052/api/grupos/' 
var apiPublicacoes = 'http://localhost:3053/api/publicacoes/' 
var apiUsers = 'http://localhost:3054/api/users/'
var apiFicheiros = 'http://localhost:3055/api/ficheiros/'



var FormData = require('form-data');
var fs = require('fs')
var multer = require('multer')
var upload = multer({
  dest:'uploads/',
  limits: {
    files: 10, // allow up to 5 files per request,
    fileSize: 5 * 1024 * 1024 // 5 MB (max file size)
  }
});

var downloadPath = __dirname + '/../downloads/'

/*
const uploadImages = multer({
  dest: 'uploads/',
  limits: {
      files: 1, // allow up to 5 files per request,
      fieldSize: 2 * 1024 * 1024 // 2 MB (max file size)
  },
  fileFilter: (req, file, cb) => {
      // allow images only
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return cb(new Error('Only image are allowed.'), false);
      }
      cb(null, true);
  }
});*/


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

function getFicheiros(publicacoes){
  return new Promise( (resolve, reject) => {
    if(publicacoes.length > 0){
      let result = publicacoes
      var length = publicacoes.length -1
      var i = 0;
      publicacoes.forEach(element => {
        axios.get(apiFicheiros + 'publicacao/' + element._id)
                .then(dados  =>{
                    result[i].files = dados.data
                    result[i].dataFormatada = new Date(element.data).toDateString()
                    if(i++ == length) resolve(result)
                })
                .catch(error => reject(error))
        })
    }
    else resolve([])
  })
}

router.get('/download/:idFicheiro/:fileName', function(req, res){
  var fileName = req.params.fileName
  axios({
    method: "get",
    url: "http://localhost:3055/api/download/" + req.params.idFicheiro,
    responseType: "stream"
      }).then(function (response) {
        var stream = response.data.pipe(fs.createWriteStream(downloadPath + fileName))      
          stream.on('finish', function(){
            res.download(downloadPath + fileName, function(erro){
              if(!erro){
                fs.unlinkSync(downloadPath + fileName, (err)=>{
                  if(err) {
                    console.log(err)
                  }
                  res.redirect('/feedNoticias')
                })
              }
             })
          })                  
  });
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
      var aux = {}
      aux.name = grupo
      aux.ucs = []
      axios.get(apiGrupos + 'subgrupos/' + grupo)
             .then(ucs =>{
                 if(ucs.data[0].gruposFilhos.length != 0){
                    aux.ucs = ucs.data[0].gruposFilhos
                 }
                 grupos.push(aux)
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
         
         subgrupos(dados.data[0].gruposFilhos).then( grupos =>{
            
            console.log(grupos)

            axios.get('http://localhost:3054/api/users')
                 .then( (users) => {res.render('curso', {curso: curso, grupos : grupos, users:users.data})})
                 .catch(erro => res.status(500).render('error', {error : erro}) ) 
         })
        })
       .catch(erro => res.status(500).render('error', {error : erro}) )

})

router.get('/feedNoticias', function(req, res, next){
  axios.get(apiPublicacoes + "grupos/principal")
        .then(dados => {
            axios.get(apiUsers)
              .then( (users) => {
                getFicheiros(dados.data)
                .then(dados =>{
                  res.render('feed', {lista : dados, users:users.data})
                } )
                .catch(erro => console.log(erro))
                 
              })
              .catch(erro => res.status(500).render('error', {error : erro}) )
        })
        .catch(erro => res.status(500).render('error', {error : erro}) )
  
})

router.get('/meuPerfil/:idUser', function(req, res, next){
  var userid = 'a3333@alunos.uminho.pt'

  axios.get(apiPublicacoes + "users/" + userid)
    .then(dados => {
      axios.get(apiUsers)
        .then( (users) => {
          getFicheiros(dados.data)
          .then(dados =>{
            //res.render('feed', {lista : dados, users:users.data})
            res.render('meuPerfil', {lista: dados, users: users.data})
          } )
          .catch(erro => console.log(erro))
            
        })
        .catch(erro => res.status(500).render('error', {error : erro}) )
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
  
})

router.get('/user/:idUser', function(req, res, nex){
  var userid = req.params.idUser

  axios.get(apiUsers + userid)
    .then(dados => {
      user = {
        email: userid,
        dataNasc: dados.data.dataNasc,
        identificador: dados.data.numAluno,
        nome: dados.data.nome,
        sexo: dados.data.sexo,
        numTelemovel: dados.data.numTelemovel,
        curso: dados.data.curso
      }
      res.jsonp(user)
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.post('/atualizaUtilizador', function(req, res, next){
  
  var iduser = req.body._id

  axios.put(apiUsers + iduser, req.body)
    .then(dados => {
      res.redirect('/meuPerfil/' + iduser)
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
})


router.get('/grupos/:idGrupo', function(req, res, next){
  var idGrupo = req.params.idGrupo
  axios.get(apiPublicacoes + "grupos/" + idGrupo)
       .then(dados => {
        axios.get(apiUsers)
             .then( (users) => {
                getFicheiros(dados.data)
                      .then(publicacoes => {
                        res.render('grupo', {users: users.data, publicacoes: publicacoes, idGrupo : idGrupo})
                      })
                      .catch(erro => res.status(500).render('error', {error : erro}) )
             })
             .catch(erro => res.status(500).render('error', {error : erro}) )
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


function form_data_files(files, idContainer, emailUser){
  return new Promise(function(resolve, reject){
    let form_data = new FormData();
    var length = files.length - 1
    var sizeFiles = 0
    for(var i = 0; i <= length; ){
      sizeFiles = files[i].size
      form_data.append('ficheiro', fs.createReadStream(files[i].path), files[i].originalname)
      if(i++ == length) {
        
        // verificar na auttenticação
        form_data.append("emailUser", emailUser)
        form_data.append("idContainer", idContainer)
        form_data.
        resolve(form_data)
      }
    }
  })
}

function post_ficheiro(files, idContainer, emailUser){
  return new Promise(function(resolve, reject){
    form_data_files(files, idContainer, emailUser)
          .then(form_data => {
            const request_config = {
              headers: {
                ...form_data.getHeaders()
              }
            };
            
            axios.post(apiFicheiros, form_data, request_config)  
                  .then(dados => resolve(dados))
                  .catch(erro => console.log(erro))
          })
    
  })
}

router.post('/publicacao/:grupo', upload.array('ficheiros'), function(req, res, next){


  var newPublicacao = req.body
  let files = req.files

  // ir buscar o nome do User e seu email ao token
  newPublicacao.emailUser = "lguilhermem@hotmail.com"
  newPublicacao.nomeUser = "Luís Martins"

  newPublicacao.grupo = req.params.grupo

  axios.post(apiPublicacoes, newPublicacao)
       .then( publicacao => {

        if(files.length > 0){
          idPublicacao = publicacao.data._id
          
          post_ficheiro(files, idPublicacao, "lguilhermem@hotmail.com")
            .then(dados => res.redirect('/feedNoticias'))

            res.redirect('/feedNoticias')

         }
         else res.redirect('/feedNoticias') 
       })
       .catch(erro => res.status(500).render('error', {error : erro}) )

})


module.exports = router;