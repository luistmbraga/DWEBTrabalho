var express = require('express');
var passport = require('passport');
var router = express.Router();

var axios = require('axios')

var nodemailer = require('nodemailer');

var apiConversas = 'http://localhost:3050/api/conversas/'
var apiMensagens = 'http://localhost:3051/api/mensagens/' 
var apiGrupos = 'http://localhost:3052/api/grupos/' 
var apiPublicacoes = 'http://localhost:3053/api/publicacoes/' 
var apiUsers = 'http://localhost:3054/api/users/'
var apiFicheiros = 'http://localhost:3055/api/ficheiros/'


var passport = require('passport')
var flash = require('connect-flash')
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')


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
  var aux;
  if(req.query.grupo){
     aux = "login?grupo="+req.query.grupo+"&"+"user="+req.query.user
  }
  else
      aux = "login"
    axios.get(apiGrupos+"tiposCursos?token="+getToken())
      .then(dados =>{
        console.log("MUAHAH")
        console.log(dados.data)
        res.render('index',{login:aux,grupos:dados.data});
      })
      .catch(erro => res.status(500).render('error', {error : erro}) )

});


router.get('/mensagens/:id',verificaAutenticacao,function(req, res, next) {
  axios.get('http://localhost:3051/api/mensagens/'+req.params.id+"?token="+getUserAcessToken(req))
  .then( (dados) => {res.jsonp(dados.data)})
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.get('/conversas',verificaAutenticacao,function(req, res, next) {
axios.get('http://localhost:3050/api/conversas/participante/'+getUserID(req)+'/simples'+"?token="+getUserAcessToken(req))
  .then(dados => res.jsonp(dados.data))
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.post('/conversas',verificaAutenticacao,function(req, res, next) {
  axios.post('http://localhost:3050/api/conversas'+"?token="+getUserAcessToken(req),req.body)
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


router.get('/logout',verificaAutenticacao,function(req, res){
  req.logout()
  res.redirect('/')
})

function getFicheiros(publicacoes,req){
  return new Promise( (resolve, reject) => {
    if(publicacoes.length > 0){
      let result = publicacoes
      var length = publicacoes.length -1
      var i = 0;
      publicacoes.forEach(element => {
        axios.get(apiFicheiros + 'publicacao/' + element._id+"?token="+getUserAcessToken(req))
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

router.get('/download/:idFicheiro/:fileName',function(req, res,next){
  var fileName = req.params.fileName
  axios({
    method: "get",
    url: "http://localhost:3055/api/download/" + req.params.idFicheiro +"?token="+getUserAcessToken(req),
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
                  res.redirect('/grupos/UM')
                })
              }
             })
          })                  
  });
})



router.post('/ficheiros/:idContainer',verificaAutenticacao, function(req, res, next){

  var ficheiros = {}

  // verificar na auttenticação
  ficheiros.emailUser = getUserID(req)

  ficheiros.idContainer = req.params.idContainer
  ficheiros.ficheiro = req.ficheiros


  axios.post(apiFicheiros+"?token="+getUserAcessToken(req), ficheiros)
        .then(dados => res.jsonp(dados))
        .error(erro => res.status(500).render('error', ))
})


/*

router.get('/grupos/:grupo', verificaAutenticacao,function(req, res, next){
  // depois ir à sessão
  var grupo = req.params.grupo
  axios.get(apiGrupos + 'subgrupos/' + grupo+"?token="+getUserAcessToken(req))
       .then(grupos => {
         console.log(grupos.data)
          if(!grupos.data[0]) {res.render('error', {error: "Esse grupo não existe!"}) ; return  }
          axios.get(apiPublicacoes + "grupos/" + grupo+"?token="+getUserAcessToken(req))
            .then(dados => {
              axios.get(apiUsers+"?token="+getUserAcessToken(req))
                  .then( (users) => {
                      getFicheiros(dados.data,req)
                            .then(publicacoes => {
                              res.render('curso', {grupo: grupo, grupos : grupos.data[0].gruposFilhos, users:users.data, publicacoes:publicacoes, user:getUserID(req)})
                            })
                            .catch(erro => res.status(500).render('error', {error : erro}) )
                  })
                  .catch(erro => res.status(500).render('error', {error : erro}) )     
            })
            .catch(erro => res.status(500).render('error', {error : erro}) ) 
        })
       .catch(erro => res.status(500).render('error', {error : erro}) )
})
*/

router.get('/grupos/:grupo', verificaAutenticacao,function(req, res, next){

  var grupoID = req.params.grupo
  axios.get(apiGrupos + grupoID+"?token="+getUserAcessToken(req))
       .then(grupo => {
         console.log("GRUPO:"+JSON.stringify(grupo.data))
          if(!grupo.data) {res.render('error', {error: "Esse grupo não existe!"}) ; return  }
          axios.get(apiPublicacoes + "grupos/" + grupoID+"?token="+getUserAcessToken(req))
            .then(dados => {
              axios.get(apiUsers+"?token="+getUserAcessToken(req))
                  .then( (users) => {
                      getFicheiros(dados.data,req)
                            .then(publicacoes => {
                              console.log(JSON.stringify(publicacoes))
                              res.render('curso', {grupo: grupo.data, grupos : grupo.data.gruposFilhos, users:users.data, publicacoes:publicacoes, user:getUserID(req),nAcess:getUserAcess(req)})
                            })
                            .catch(erro => res.status(500).render('error', {error : erro}) )
                  })
                  .catch(erro => res.status(500).render('error', {error : erro}) )     
            })
            .catch(erro => res.status(500).render('error', {error : erro}) ) 
        })
       .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.get('/feedNoticias', verificaAutenticacao,function(req, res, next){
  
  axios.get(apiPublicacoes + "grupos/UM"+"?token="+getUserAcessToken(req))
        .then(dados => {
            axios.get(apiUsers+"?token="+getUserAcessToken(req))
              .then( (users) => {
                getFicheiros(dados.data,req)
                .then(dados =>{
                  res.render('feed', {lista : dados, users:users.data, user:getUserID(req),nAcess:getUserAcess(req)})
                } )
                .catch(erro => console.log(erro))
              })
              .catch(erro => res.status(500).render('error', {error : erro}) )
        })
        .catch(erro => res.status(500).render('error', {error : erro}) )
  })

router.get('/meuPerfil',verificaAutenticacao, function(req, res, next){
  
  var userid = getUserID(req)
  console.log(userid)
  axios.get(apiPublicacoes + "users/" + userid+"?token="+getUserAcessToken(req))
    .then(dados => {
      axios.get(apiUsers+"?token="+getUserAcessToken(req))
        .then( (users) => {
          getFicheiros(dados.data,req)
          .then(dados =>{
            axios.get(apiUsers+userid+"?token="+getUserAcessToken(req))
              .then( (user) => {
                console.log(user.nome)
                            //res.render('feed', {lista : dados, users:users.data})
            res.render('meuPerfil', {lista: dados, users: users.data,user:getUserID(req), userU:user.data,nAcess:getUserAcess(req)})
              })
              .catch(erro => res.status(500).render('error', {error : erro}))

          } )
          .catch(erro => res.status(500).render('error', {error : erro}))
            
        })
        .catch(erro => res.status(500).render('error', {error : erro}) )
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.get('/user/:idUser', verificaAutenticacao,function(req, res, nex){
  var userid = req.params.idUser

  axios.get(apiUsers + userid+"?token="+getUserAcessToken(req))
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

router.get('/meusgrupos/', verificaAutenticacao,function(req, res, nex){
  var userid = getUserID(req)
  axios.get(apiUsers + userid+"?token="+getUserAcessToken(req))
    .then(dados => {
      axios.get(apiUsers+"?token="+getUserAcessToken(req))
        .then( (users) => {
          dados.data.grupos.shift()
        res.render('meusgrupos', {users: users.data,user:getUserID(req) ,userU: dados.data,nAcess:getUserAcess(req)})
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
  })
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.get('/eventos/', verificaAutenticacao,function(req, res, nex){
  axios.get(apiGrupos +"eventos?token="+getUserAcessToken(req))
    .then(eventos => {
      axios.get(apiUsers+"?token="+getUserAcessToken(req))
        .then( (users) => {
          getUser(getUserID(req))
          .then(dados =>{
            eventos.data = eventos.data.filter( function( el ) {
              return !dados.grupos.includes( el._id );
            } );
            res.render('eventos', {grupos: eventos.data,users: users.data, user: getUserID(req),nAcess:getUserAcess(req)})
          })
          .catch(erro => res.status(500).render('error', {error : erro}) )
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
  })
    .catch(erro => res.status(500).render('error', {error : erro}) )
})


router.get('/databases/', verificaAutenticacao,function(req, res, nex){
      axios.get(apiUsers+"?token="+getUserAcessToken(req))
        .then( (users) => {
            res.render('databases', {users: users.data, user: getUserID(req),nAcess:getUserAcess(req)})
          })
          .catch(erro => res.status(500).render('error', {error : erro}) )
})


router.get('/addGrupo/', verificaAutenticacao,function(req, res, nex){
      axios.get(apiUsers+"?token="+getUserAcessToken(req))
        .then( (users) => {
        res.render('addGrupo', {users: users.data, user: getUserID(req),nAcess:getUserAcess(req)})
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.get('/grupos/', verificaAutenticacao,function(req, res, nex){
  axios.get(apiUsers+"?token="+getUserAcessToken(req))
    .then( (users) => {
      axios.get(apiGrupos+"cursos"+"?token="+getUserAcessToken(req))
        .then( (cursos) => {
          axios.get(apiGrupos+"eventos"+"?token="+getUserAcessToken(req))
          .then( (eventos) => {
            res.render('grupos', {users: users.data, user: getUserID(req),cursos:cursos.data,eventos:eventos.data,nAcess:getUserAcess(req)})
         })
         .catch(erro => res.status(500).render('error', {error : erro}) )
        })
        .catch(erro => res.status(500).render('error', {error : erro}) )
})
.catch(erro => res.status(500).render('error', {error : erro}) )
})


router.post('/atualizaUtilizador', verificaAutenticacao,function(req, res, next){
  
  var iduser = req.body._id 
  var newUser = req.body
  if(newUser.pass == ""){
    delete newUser.pass
  }
  else
  newUser.pass = bcrypt.hashSync(req.body.pass, 10);

  axios.put(apiUsers + iduser+"?token="+getToken(3), newUser)
    .then(dados => {
      res.redirect('/meuPerfil/')
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.post('/login', passport.authenticate('local', 
  { failureRedirect: '/',
    failureFlash: 'Utilizador ou password inválido(s)...'
  }),
  function(req, res) {
    console.log(req.session)
      axios.get(apiUsers+getUserID(req)+"?token="+getToken())
      .then(user =>{
        console.log(user.data)
        if(req.query.grupo){
            axios.put(apiUsers+req.query.user+"/"+req.query.grupo+"?token="+getUserAcessToken(req))
            .then((dados) => {res.render("addSucesso")})
            .catch(erro => res.status(500).render('error', {error : erro}))
        }
        else if(user.data.nAcess == -1)
          res.render('contaInativa',{user:user.data});
        else 
          res.redirect('/grupos/UM');
      })


  
    })

router.get('/resendEmail/:id',function(req,res){

  axios.get(apiUsers+req.params.id+"?token="+getToken())
       .then( (dados) =>{
         var user = dados.data;
         if(user.nAcess < 0){
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'costumeranafreitas@gmail.com',
      pass: 'Teste123456.'
    }
  });
        var user = dados.data
        var mailOptions = {
          from: 'costumeranafreitas@gmail.com',
          to: 'filipe-cunha1@hotmail.com',
          subject: 'Reenvio de Ativação de conta UMbook',
          html: "Caro Utilizador,<html><br/>" +
          " Enviamos-lhe este email para o notificar sobre o resgisto à nossa aplicação UMbook<br/>"+
          " Caso não se tenha registado na  nossa aplicação pedimos que ignore este email.<br/>" +
          " Para ativar a sua conta clique no link abaixo:<br/>" +
          "<a href='http://localhost:1234/ativarConta/"+user._id+"?hash="+user.token+"'>Ativar Conta</a></br>"+
          "Se alguma duvida persistir nao hesite em contactar o nosso suporte em <a href=https://www.uminho.pt/PT>https://www.uminho.pt/PT</a>" +
          "<br/>Atenciosamente<br/>UmBook <br/>UMinho!<br/><br/><img src='http://join.di.uminho.pt/images/org/ee-um.png' alt='https://www.uminho.pt/PT' style='width:400px;height:200px;'></html>"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      res.render('contaInativa',{user:user})
      }
      else{
        res.redirect('/') /////// TALVEZ MUDAR ISTO
      }
    } )
    .catch(erro => res.status(500).render('error', {error : erro}) )

})

router.post('/grupos',function(req, res, next){
  var grupo = req.body
  console.log(grupo)
  axios.post(apiGrupos+"?token="+getToken(20), grupo)
       .then( (dados) =>{

        res.redirect('/grupos')
       } )
       .catch(erro => {console.log(erro);res.status(500).render('error', {error : erro})} )
})

router.post('/utilizador',function(req, res, next){
  var newUser = req.body
  newUser.pass = bcrypt.hashSync(req.body.pass, 10);
  newUser.grupos = []
  console.log(newUser)
  axios.post(apiUsers+"?token="+getToken(), newUser)
       .then( (dados) =>{
          
        var transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: 'costumeranafreitas@gmail.com',
            pass: 'Teste123456.'
          }
        });
              var user = dados.data
              var mailOptions = {
                from: 'costumeranafreitas@gmail.com',
                to: 'filipe-cunha1@hotmail.com',
                subject: 'Ativação de conta UMbook',
                html: "Caro Utilizador,<html><br/>" +
                " Enviamos-lhe este email para o notificar sobre o resgisto à nossa aplicação UMbook<br/>"+
                " Caso não se tenha registado na  nossa aplicação pedimos que ignore este email.<br/>" +
                " Para ativar a sua conta clique no link abaixo:<br/>" +
                "<a href='http://localhost:1234/ativarConta/"+user._id+"?hash="+user.token+"'>Ativar Conta</a></br>"+
                "Se alguma duvida persistir nao hesite em contactar o nosso suporte em <a href=https://www.uminho.pt/PT>https://www.uminho.pt/PT</a>" +
                "<br/>Atenciosamente<br/>UmBook <br/>UMinho!<br/><br/><img src='http://join.di.uminho.pt/images/org/ee-um.png' alt='https://www.uminho.pt/PT' style='width:400px;height:200px;'></html>"
              };
              
              transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
              });
        res.redirect('/')
       } )
       .catch(erro => res.status(500).render('error', {error : erro}) )
})


function form_data_files(files, idContainer, emailUser){
  return new Promise(function(resolve, reject){
    let form_data = new FormData();
    var length = files.length - 1
    console.log("WTFFFF")
    console.log(files)
    for(var i = 0; i <= length; ){
      sizeFiles = files[i].size
      console.log(files[i])
      form_data.append('ficheiro', fs.createReadStream(files[i].path), files[i].originalname)
      if(i++ == length) {
        
        // verificar na auttenticação
        form_data.append("emailUser", emailUser)
        form_data.append("idContainer", idContainer)
        resolve(form_data)
      }
    }
  })
}

router.post('/utilizadorFacebook', verificaAutenticacao,function(req, res, next){
  var newUser = req.body
  newUser.grupos = []
  newUser.grupos.push(newUser.curso)
  console.log(newUser)
  console.log(req.session)
  console.log(req.session.passport.user)
  newUser.nAcess = 0;
  axios.put(apiUsers+getUserID(req)+"?token="+getToken(4), newUser)
       .then( () => res.redirect('/grupos/UM') )
       .catch(erro => res.status(500).render('error', {error : erro}) )
})

function limpaUpload(files){
  return new Promise(function(resolve, reject){
    var length = files.length - 1
    for(var i = 0; i <= length; ){
      fs.unlinkSync(files[i].path , (err) => {
        if (err) {
          console.error(err)
        }
      
        //file removed
      })
      if(i++ == length) {
        resolve([])
      }
    }
  })
}

function post_ficheiro(files, idContainer, emailUser,req){
  return new Promise(function(resolve, reject){
    var ficheiros = files
    form_data_files(ficheiros, idContainer, emailUser)
          .then(form_data => {
            const request_config = {
              headers: {
                ...form_data.getHeaders()
              }
            };
            
            axios.post(apiFicheiros+"?token="+getUserAcessToken(req), form_data, request_config)  
                  .then(dados => {
                    limpaUpload(ficheiros)
                    resolve(dados)})
                  .catch(erro => console.log(erro))
          })
    
  })
}

router.post('/publicacao/:grupo',verificaAutenticacao, upload.array('ficheiros'), function(req, res, next){

  var newPublicacao = req.body
  let files = req.files

  // ir buscar o nome do User e seu email ao token

  axios.get(apiUsers + getUserID(req)+"?token="+getUserAcessToken(req))
  .then(dados => {
    var user = dados.data;
    newPublicacao.emailUser = user._id
    newPublicacao.nomeUser = user.nome

    newPublicacao.grupo = req.params.grupo
  
    axios.post(apiPublicacoes+"?token="+getUserAcessToken(req), newPublicacao)
         .then( publicacao => {
  
          if(files.length > 0){
            idPublicacao = publicacao.data._id
            
            post_ficheiro(files, idPublicacao, user._id,req)
              .then(() => res.redirect('/grupos/' + req.params.grupo))
  
           }
           else res.redirect('/grupos/' + req.params.grupo) 
         })
         .catch(erro => res.status(500).render('error', {error : erro}) )
  })
  .catch(erro => res.status(500).render('error', {error : erro}) )
})


router.delete('/publicacao/:idPublicacao', verificaAutenticacao,function(req, res, next){
  var idPublicacao = req.params.idPublicacao
  axios.delete(apiPublicacoes + idPublicacao+"?token="+getUserAcessToken(req))
       .then(() => {
         res.jsonp("Eliminado com Sucesso!")
      })
       .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.get('/ativarConta/:id', upload.array('ficheiros'), function(req, res, next){

  var userId = req.params.id;
  var hash = req.query.hash

  getUser(userId)
  .then(user => {
    console.log(user)
    if(user.token == hash)
      axios.put(apiUsers+userId+"?token="+getToken(3),{nAcess:0})
      .then(dados => res.render('ativoSucesso'))
      .catch(erro => res.status(500).render('error', {error : erro}) )
  })
  .catch(erro => res.status(500).render('error', {error : erro}) )
})

router.get('/pedirAcesso/:idgrupo', verificaAutenticacao,function(req, res, next){
  var grupo = req.params.idgrupo
  var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'costumeranafreitas@gmail.com',
      pass: 'Teste123456.'
    }
  });

  axios.get(apiUsers + getUserID(req)+"?token="+getUserAcessToken(req))
  .then(dados => {
        var user = dados.data
        var mailOptions = {
          from: 'costumeranafreitas@gmail.com',
          to: 'filipe-cunha1@hotmail.com',
          subject: 'Pedido de acesso ao Grupo:'+grupo,
          html: "Caro Utilizador,<html><br/>" +
          " Enviamos-lhe este email para o notificar sobre um pedido de acesso ao grupo: "+grupo+" relizado pelo seguinte utilizador:<br/>"+
          " Dados do Utilizador:<br/>" +
          "Email: "+user._id+"<br/>"+
          "Nome: " +user.nome+"<br/>"+
          "Curso: " +user.curso+"<br/>"+
          "Numero: " +user.numAluno+"<br/>"+
          "Sexo: "+ user.sexo+"<br/>"+
          "Telemovel: " +user.numTelemovel+"<br/>"+
          "Data Nascimento: " +user.dataNasc+"<br/>"+
          "Para Aceitar este pedido clique no link abaix:"+
          "<a href='http://localhost:1234/?grupo="+grupo+"&user="+user._id+"'>Aceitar Pedido</a></br>"+
          "Se alguma duvida persistir nao hesite em contactar o nosso suporte em <a href=https://www.uminho.pt/PT>https://www.uminho.pt/PT</a>" +
          "<br/>Atenciosamente<br/>UmBook <br/>UMinho!<br/><br/><img src='http://join.di.uminho.pt/images/org/ee-um.png' alt='https://www.uminho.pt/PT' style='width:400px;height:200px;'></html>"
        };
        
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
            res.redirect("/eventos")
          }
        });

  })
  .catch(erro => res.status(500).render('error', {error : erro}) )
})


function form_data_file(file){
  return new Promise(function(resolve, reject){
    let form_data = new FormData();
      form_data.append('json', fs.createReadStream(file.path), file.originalname)
      resolve(form_data)
  })
}

router.get('/drop', verificaAutenticacao, function(req, res, next){
  axios.delete("http://localhost:3056/api/dbManager/drop?token="+getUserAcessToken(req))
       .then(dados => {
         res.redirect('/databases')
       })
       .catch(erro => {
         console.log(erro)
       })
})

// o input do file tem que se chamar json ou altera este nome
router.post('/importData', upload.single('json'), function(req, res, next){  
  axios.delete("http://localhost:3056/api/dbManager/drop?token="+getToken(10))
       .then(dados => {
  form_data_file(req.file)
          .then(form_data => {
    
            const request_config = {
              headers: {
                ...form_data.getHeaders()
              }
            };

            axios.post("http://localhost:3056/api/dbManager/import?token="+getToken(10), form_data, request_config)  
                  .then(dados => {
                    console.log(dados.data)
                    res.redirect('/databases')
                  })
                  .catch(erro => res.jsonp(erro.response.data.message))
                  .finally(()=> {
                    ficheiros = []
                    ficheiros.push(req.file)
                    limpaUpload(ficheiros)
                  })
          
          })
          .catch(erro => console.log(erro))
        })
          .catch(erro => {
            console.log(erro)})
})


router.get('/exportData', verificaAutenticacao, function(req, res, next){
  var fileName = 'UMbook.json'
  axios({
    method: "get",
    url: "http://localhost:3056/api/dbManager/export?token="+getUserAcessToken(req),
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
                  res.redirect('/grupos/UM')
                })
              }
             })
          })                  
  });
})


router.get('/auth/facebook',
  passport.authenticate('facebook'));

router.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    axios.get(apiUsers + getUserID(req)+"?token="+getToken())
    .then(dados => {
        console.log("User: " +JSON.stringify(dados.data))
    if(dados.data.curso == null){
      axios.get(apiGrupos+"tiposCursos?token="+getToken())
      .then(dados =>{
        res.render('registaFacebook',{grupos:dados.data});
      })
      .catch(erro => res.status(500).render('error', {error : erro}) )
    }
    else
      res.redirect('/grupos/UM');
    })
    .catch(erro => res.status(500).render('error', {error : erro}) )
  });



function verificaAutenticacao(req,res,next){
    console.log("VOU TENTAR AUTENTICAR")
    if(req.isAuthenticated()){
    //req.isAuthenticated() will return true if user is logged in
      next();
    } else{
      res.redirect("/");}
  }

function getUserAcessToken(req)
{
    return jwt.sign({ sub: 'token gerado no TP DAW2019',nAcess:getUserAcess(req)},"daw2019",
    {
      expiresIn: 60,
      issuer:'Servidor Interface Web',
    })
}

function getToken(acess){
  var aux = 0;
  if(acess)
  aux = acess
    return  jwt.sign({ sub: 'token gerado no TP DAW2019',nAcess:aux},"daw2019",
    {
        expiresIn: 60,
        issuer:'Servidor Interface Web',
    })
}

function getUser(user){
    return new Promise((resolve,reject) => {
      axios.get(apiUsers+user+"?token="+getToken())
      .then((dados) => {resolve(dados.data)})
        .catch((erro)=>{reject(erro)})
    })

  }

  function getUserID(req){
    return req.session.passport.user.email;
  }

  function getUserAcess(req){
    return req.session.passport.user.nAcess;
  }

module.exports = router;