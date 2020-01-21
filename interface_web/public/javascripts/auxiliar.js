var host = 'http://localhost:1234/'

function showRegisto(){
    var registo = 
    '<div class="w3-card-4">' +
        '<div class="w3-container">' +
            '<form class="w3-container" action="/utilizador" method="POST"></form>' +
            '<input class="w3-input w3-border" type="text" name="email" placeholder="Email" required="required" /><input class="w3-input w3-border" type="text" name="idEstudante" placeholder="Identificador de Estudante" required="required"'+
            '/><input class="w3-input w3-border" type="date" name="dataNascimento" placeholder="Data de Nascimento" required="required" /><input class="w3-input w3-border" type="text" name="github" placeholder="GitHub" /><input class="w3-input w3-border"' +
                'type="password" name="password" placeholder="Password" required="required" /><button class="w3-hover-green" type="submit" style="background-color: DodgerBlue; color: white; heigth: 10%; width:100%; padding:12px; font-size:15px; border-radius: 12px;">Registar</button></div>'
    + '</div>' +
    '</div>'
    $('#display').empty()
    $('#display').append(registo)
    $('#display').modal()
}

function logout(){
    axios.get('http://localhost:1234/logout')
         .catch(error => console.log(error))
}