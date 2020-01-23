
var host = 'http://localhost:1234/'

function showRegisto(){
    var registo = 
    '<div class="w3-container">' +
    ' <form method="POST" action="/utilizador"><input class="w3-input w3-border" type="text" name="_id"' + 
    ' placeholder="Email" required="required" /><input class="w3-input w3-border" type="password" name="pass" placeholder="Password"'+
    ' required="required" /><input class="w3-input w3-border"' +
    ' type="date" name="dataNasc" placeholder="Data de Nascimento" required="required" ' +
    ' /><input class="w3-input w3-border" type="text" name="numAluno" placeholder="Identificador (Número) de Estudante" required="required"' + 
    ' /><input class="w3-input w3-border" type="text" name="nome" placeholder="Nome" ' + 
    ' required="required" /><input class="w3-input w3-border" type="text" name="sexo" placeholder="Sexo" /> ' + 
    '<input class="w3-input w3-border" type="number" name="numTelemovel" placeholder="Número de telemóvel" ' +
        '/><input class="w3-input w3-border" type="text" name="curso" placeholder="Curso" /> ' + 
        '<button class="w3-hover-green" type="submit" style="background-color: DodgerBlue; color: white; width:100%; padding:15px; ' + 
        'font-size:20px; border-radius: 12px;">Registar</button></form> </div>'

    $('#display').empty()
    $('#display').append(registo)
    $('#display').modal()
}

function logout(){
    axios.get('http://localhost:1234/logout')
         .catch(error => console.log(error))
}