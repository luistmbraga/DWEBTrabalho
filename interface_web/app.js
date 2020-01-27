var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken')
var bodyParser = require('body-parser')

// Módulos de suporte à autenticação
var uuid = require('uuid/v4')
var session = require('express-session')
var FileStore = require('session-file-store')(session)

var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
var FacebookStrategy = require('passport-facebook').Strategy
var axios = require('axios')
var flash = require('connect-flash')
//-----------------------------------
var accessToken = "EAAncIe8Fzz0BAPYc5w1figOqJOI8whon7XLEbWqReki7M3aW1t1tB60z2wHhdGnZB7FowkkZAHpiBhmyr6bZAqNZCxjKwbR9Y4OjfMMCAhp4DBuLX3dkak3HbLy4RseYx7UsrdpSyZAPqKs6nyNUBjGwwj7NgCEfuH2fDljdRJfKcz8kkO4o9cUA45TqVQGFW4rhL8JfZBr0pEbPWOFCQWA653VZBf5SgTGZBV4JZAVmFyCsIKWWYLhfb"
var FACEBOOK_APP_ID= 2775313092562749
var FACEBOOK_APP_SECRET= "6ff5bee1a9a5dbbbd5ab1e3fccf4ee77"

passport.use(new FacebookStrategy({
  clientID: FACEBOOK_APP_ID,
  clientSecret: FACEBOOK_APP_SECRET,
  callbackURL: "http://localhost:1234/auth/facebook/callback",
  profileFields: ['id', 'displayName','email'],
  enableProof: true
},
function(accessToken, refreshToken, user, cb) {
  //console.log(user)
  var newUser = {}
  newUser._id = user._json.email
  newUser.nome = user.displayName
  newUser.sexo = user.genre
  newUser.nAcess = 1

  var token = jwt.sign({ sub: 'token gerado no TP DAW2019',nAcess:0},"daw2019",
  {
      expiresIn: 60,
      issuer:'Servidor UMbook',
  })

console.log(newUser)
  axios.get('http://localhost:3054/api/users/' + newUser._id+'?token='+token)
  .then(dados => {
    if(dados.data == null){
      axios.post('http://localhost:3054/api/users/?token='+token,newUser)
      .then(dados => {
        console.log(dados.data)
        return cb(null,dados.data);
    })
    .catch(erro => {console.log("ERRO FACEBOOK");done(erro)})
    }
    return cb(null,newUser);
  })
  .catch(erro => {console.log("ERRO FACEBOOK");done(erro)})



}
));


// Configuração da estratégia local
passport.use(new LocalStrategy(
  {usernameField: 'email'}, (email, password, done) => {
    var token = jwt.sign({ sub: 'token gerado no TP DAW2019',nAcess:0},"daw2019",
    {
        expiresIn: 60,
        issuer:'Servidor UMbook',
    })
  axios.get('http://localhost:3054/api/users/' + email+'?token='+token)
    .then(dados => {
      console.log("STRATEGY")
      const user = dados.data
      console.log("USER"+ JSON.stringify(user));
      if(!user) { return done(null, false, {message: 'Utilizador inexistente!\n'})}
      console.log("PASS: "+password)
      console.log("USER PASS: " +user.pass)
      if(!bcrypt.compareSync(password,user.pass)) { return done(null, false, {message: 'Password inválida!\n'})}
      return done(null, user)
  })
  .catch(erro => {console.log("ERRO");done(erro)})
}))

// Indica-se ao passport como serializar o utilizador
passport.serializeUser((user,done) => {
  console.log('Vou serializar o user: ' + JSON.stringify(user))
  // Serialização do utilizador. O passport grava o utilizador na sessão aqui.
  done(null, {email:user._id,nAcess:user.nAcess})
})
  
// Desserialização: a partir do id obtem-se a informação do utilizador
passport.deserializeUser((o, done) => {
  console.log(o)
  var token = jwt.sign({ sub: 'token gerado na aula DAW2019',nAcess:0},"daw2019",
  {
      expiresIn: 60,
      issuer:'Servidor UMbook',
  })
  console.log('Vou desserializar o utilizador: ' + o.email)
  axios.get('http://localhost:3054/api/users/' + o.email+'?token='+token)
    .then(dados => done(null, dados.data))
    .catch(erro => done(erro, false))
})


var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(session({
  genid: req => {
    console.log('Dentro do middleware da sessão...')
    console.log(req.sessionID)
    return uuid()
  },
  //store: new FileStore(),
  secret: 'O meu segredo',
  resave: false,
  saveUninitialized: true
}))

app.use(passport.initialize());
app.use(passport.session());
  
app.use(flash());

app.use(bodyParser.json({limit: '100mb'}))
app.use(logger('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
