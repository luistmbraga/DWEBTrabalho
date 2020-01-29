
var host = 'http://localhost:1234/'





//var 

function showRegisto(){
    var registo = 
    '<div class="w3-container">' +
    '<h3> Registar Utilizador </h3>'+  
    ' <form method="POST" action="/utilizador"><input class="w3-input w3-border" type="text" name="_id"' + 
    ' placeholder="Email" required="required" /><input class="w3-input w3-border" type="password" name="pass" placeholder="Password"'+
    ' required="required" /><input class="w3-input w3-border"' +
    ' type="date" name="dataNasc" placeholder="Data de Nascimento" required="required" ' +
    ' /><input class="w3-input w3-border" type="text" name="numAluno" placeholder="Identificador (Número) de Estudante" required="required"' + 
    ' /><input class="w3-input w3-border" type="text" name="nome" placeholder="Nome" ' + 
    ' required="required" /><input class="w3-input w3-border" type="text" name="sexo" placeholder="Sexo" /> ' + 
    '<input class="w3-input w3-border" type="number" name="numTelemovel" placeholder="Número de telemóvel" ' +
        '/>'+
        '<select id ="mySelect2" style="width:100%" class="js-example-basic-single" name="state">'+
      '</select>'+
      '<input class="w3-input w3-border"  id="inputgrupo" type="hidden" name="curso"/>'+
        '<button class="w3-hover-green" type="submit" style="background-color: DodgerBlue; color: white; width:100%; padding:15px; ' + 
        'font-size:20px; border-radius: 12px;">Registar</button></form> </div>'

    $('#display').empty()
    $('#display').append(registo)
    for(i in grupos)
        $('#mySelect2').append('<option value="'+grupos[i]+'">'+grupos[i]+'</option>');

    $("js-example-basic-single").select2(); 
    $('#mySelect2').select2({
        dropdownParent: $('#display')
    });
    $('#mySelect2').on('select2:select', function (e) {
        console.log($('#mySelect2').find(':selected').val())
        $('#inputgrupo').val($('#mySelect2').find(':selected').val())
      });

    $('#display').modal()
}


function showRegistoFacebook(){
    var registo = 
    '<div class="w3-container">' +
    ' <form method="POST" action="/utilizadorFacebook"><input class="w3-input w3-border"' +
    ' type="date" name="dataNasc" placeholder="Data de Nascimento" required="required" ' +
    ' /><input class="w3-input w3-border" type="text" name="numAluno" placeholder="Identificador (Número) de Estudante" required="required"' + 
    ' /><input class="w3-input w3-border" type="text" name="sexo" placeholder="Sexo" /> ' + 
    '<input class="w3-input w3-border" type="number" name="numTelemovel" placeholder="Número de telemóvel" ' +
        '/>'+
        '<select id ="mySelect22" style="width:100%" class="js-example-basic-single" name="state">'+
      '</select>'+'</hr>' + 
      '<input class="w3-input w3-border"  id="inputgrupo" type="hidden" name="curso"/>'+
        '<hr><button class="button01" type="submit" style=" width:50%;">Avançar</button></form> </div>'
        console.log(grupos)
        $('#teste').append(registo)
    for(i in grupos)
        $('#mySelect22').append('<option value="'+grupos[i]+'">'+grupos[i]+'</option>');

    $('#mySelect22').on('select2:select', function (e) {
        console.log($('#mySelect22').find(':selected').val())
        $('#inputgrupo').val($('#mySelect22').find(':selected').val())
      });
}

function addTableRow(table){
    $('#'+table).append("<tr><td><input class ='w3-input w3-border w3-light-grey' type='text' placeholder='Grupo Filho'>"+
                        "<td><button class='button01' type='' style='width:50%' onclick='removeTableRow(this,\""+table+"\")'>Remover</button></td>"+
                       "</tr>")
}

function removeTableRow(elem,table){
    var index = $(elem).closest('td').parent()[0].sectionRowIndex;
	if (index > -1) {
        console.log(table)
        document.getElementById(table).deleteRow(index);
	}
}


function getTableInputValues(table){
    var values = [];
    console.log(table)
    $('#'+table+' tr').each(function() {
        console.log("FFF")
        values.push($(this).find("input").val())
    });
    return values;
}
function createGroup(){
    var grupo = {};
    grupo._id = $('#_id').val()
    if($('#curso').val()!="")
    grupo.curso = $('#curso').val()
    if($('#checkbox').is(':checked')){
        grupo.desc_dependencia = 1
        grupo.gruposFilhos = getTableInputValues('table')
    }
    else{
        grupo.desc_dependencia = 0
        grupo.gruposFilhos = []
    }

    console.log("Vou tentar criar o Grupo:")
    console.log(grupo)
    axios.post("http://localhost:1234/grupos",grupo)
        .then(response => window.location.assign('/grupos'))
        .catch(error => console.log(error))
}


function updateUser(idUser){
    axios.get('http://localhost:1234/user/' + idUser)
        .then(dados => {
            console.log(dados)
            var registo = 
            '<div class="w3-container">' +
             '<h3> Alterar Utilizador </h3>'+   
                '<form method="POST" action="http://localhost:1234/atualizaUtilizador/">' +
                    '<input class="w3-input w3-border" type="text" name="_id" value="'+ dados.data.email +'" required="required"/>' +
                    '<input class="w3-input w3-border" type="text" name="dataNasc" value="'+dados.data.dataNasc+'" onfocus="(this.type=`date`)" />' +
                    '<input class="w3-input w3-border" type="password" name="pass" value="" placeholder="password" />' +
                    '<input class="w3-input w3-border" type="text" name="numAluno" value="'+dados.data.identificador+'" />' +
                    '<input class="w3-input w3-border" type="text" name="nome" value="'+dados.data.nome+'"  />' +
                    '<input class="w3-input w3-border" type="text" name="sexo" value="'+dados.data.sexo+'" /> ' + 
                    '<input class="w3-input w3-border" type="number" name="numTelemovel" value="'+dados.data.numTelemovel+'" />' +
                    '<input class="w3-input w3-border" type="text" name="curso" value="'+dados.data.curso+'" /> ' + 
                        '<button class="w3-hover-dark-grey" type="submit" style="background-color: #990000; color: white; width:100%; padding:15px; ' + 
                        'font-size:20px; border-radius: 12px;">' +
                            'Atualizar' +
                        '</button>' +
                '</form>' +
             '</div>'

            $('#display').empty()
            $('#display').append(registo)
            $('#display').modal()
        })
}

function apagaPublicacao(id){
    console.log(id)
    axios.delete('http://localhost:1234/publicacao/' + id)
         .then(() => location.reload(true))
         .catch(error => console.log(error))
}

function Filevalidation(){ 
    const fi = document.getElementById('ficheiros'); 
    // Check if any file is selected. 
    if (fi.files.length > 0) { 
        if(fi.files.length > 10) alert('Apenas são permitidos 10 ficheiros')
        
        for (const i = 0; i <= fi.files.length - 1; i++) { 

            const fsize = fi.files.item(i).size; 
            const file = Math.round((fsize / 1024 )); 
            // The size of the file. 
            if (file > 1024*5) {
                fi.value = [] 
                alert( "File too Big, please select a file less than 5mb"); 
            } 
        } 
    } 
} 


function onTestChange() {
    var key = window.event.keyCode;

    // If the user has pressed enter
    if (key === 13) {
        document.getElementById("conteudo").value = document.getElementById("conteudo").value + "\n*";
        return false;
    }
    else {
        return true;
    }
}

function logout(){
    axios.get('http://localhost:1234/logout')
         .catch(error => console.log(error))
}
