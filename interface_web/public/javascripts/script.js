var conversas;

$(document).ready(function(){
	var teste = "a1@alunos.uminho.pt";
	var socket = io.connect('http://localhost:1234',{ query: "username="+teste });
	console.log(teste);

	var arr = []; // List of users	
		console.log(users);
	
	 //mostrar/esconder box de chat
	$(document).on('click', '.msg_head', function() {
		var chatbox = $(this).parents().attr("rel") ;
		$('[rel="'+chatbox+'"] .msg_wrap').slideToggle('slow');
		return false;
	});
	
	// fechar box chat
	$(document).on('click', '.close', function() {		
		var chatbox = $(this).parents().parents().attr("rel") ;
		$('[rel="'+chatbox+'"]').hide();
		arr.splice($.inArray(chatbox, arr), 1);
		displayChatBox();
		return false;
	});

	//clique na barra lateral
	$(document).on('click', '.sidebar-user-box', function() {	
	 var userID = $(this).attr("id");
	 var username = $(this).children().text();
	 var user = getUser(userID);
	 getConversas()
	 .then((dados) => {
		 console.log("conversas: "+JSON.stringify(dados));
		 conversas = dados;
		 for(i in conversas)
			 for(j in users){
				 if(conversas[i].participantes[0] == users[j]._id || conversas[i].participantes[1] == users[j]._id){
					 users[j].id_conversa = conversas[i]._id;
					 console.log("LALALALALLALAA" + users[j]._id)
					 break;
				 }
			 }

			 console.log(users)
	 if(user.id_conversa == undefined){
		console.log("CRIOU CONVERSA")
		createConversa(user._id,teste)
			.then((conversa) => user.id_conversa = conversa._id )
	 }
	 displayUserMessages(user)
	 if ($.inArray(userID, arr) != -1)
	 {
      arr.splice($.inArray(userID, arr), 1);
     }
	 
	 arr.unshift(userID);
	 chatPopup =  '<div class="msg_box" style="right:270px" rel="'+ userID+'">'+
					'<div class="msg_head">'+username +
					'<div class="close">x</div> </div>'+
					'<div class="msg_wrap"> <div class="msg_body">	<div class="msg_push"></div> </div>'+
					'<div class="msg_footer"><textarea class="msg_input" rows="4"></textarea></div> 	</div> 	</div>' ;					
				
     $("body").append(  chatPopup  );
	 displayChatBox();
	 console.log(arr)

	 })
	 
	});


	
	//var chatbox;
	$(document).on('keypress', 'textarea' , function(e) {   
		//se pressiona enter	    
        if (e.keyCode == 13 ) { 		
			var msg = $(this).val();		
			$(this).val('');
			if(msg.trim().length != 0){			
				var chatbox = $(this).parents().parents().parents().attr("rel") ;
				$('<div class="msg-right">'+msg+'</div>').insertBefore('[rel="'+chatbox+'"] .msg_push');
				$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
				var data = {}
				var user = getUser(chatbox)
				data.to = user._id;
				data.idConversa = user.id_conversa;
				data.texto = msg;
				data.from = teste;
				socket.emit('private', data);
			}
        }
	});
	
	socket.on('private', function(data){
		//$(data.msg).insertBefore('[rel="'+data.from+'"] .msg_push');
		$('<div class="msg-left">'+data.texto+'</div>').insertBefore('[rel="'+data.from+'"] .msg_push');
				//$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
	  });

	  socket.on('erro', function(data){
		$('<div class="msg-left">'+data.erro+'</div>').insertBefore('[rel="'+data.from+'"] .msg_push');
			//	$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
	  });
	
	function createConversa(from,to){
		var participantes = [];
		participantes.push(from);
		participantes.push(to);
		var aux = {};
		aux.participantes= participantes;
		console.log(participantes)
		return new Promise((resolve,reject) => {
			axios.post('http://localhost:1234/conversas/',aux)
				.then((id) => {resolve(id.data)})
				.catch((erro)=>{reject(erro)})
		})
	}
		
	function displayUserMessages(user){
		axios.get('http://localhost:1234/mensagens/'+user.id_conversa)
    		.then((dados) => {
				dados.data.forEach(e => displayMessage(e,user._id))
			})
			.catch((erro)=>{console.log(erro)})
		}

	function displayMessage(msg,userId){
		var type;
		console.log(msg)
		if(msg.from == teste) type = "right"; else type = "left";
		$('<div class="msg-'+type+'">'+msg.texto+'</div>').insertBefore('[rel="'+userId+'"] .msg_push');
				$('.msg_body').scrollTop($('.msg_body')[0].scrollHeight);
	}

	function displayChatBox(){ 
	    i = 270 ; // start position
		j = 260;  //next position
		
		$.each( arr, function( index, value ) {  
		   if(index < 4){
	         $('[rel="'+value+'"]').css("right",i);
			 $('[rel="'+value+'"]').show();
		     i = i+j;			 
		   }
		   else{
			 $('[rel="'+value+'"]').hide();
		   }
        });		
	}	
	
});

function getConversas(){
	return new Promise((resolve,reject) => {
		axios.get('http://localhost:1234/conversas/')
			.then((dados) => {resolve(dados.data)})
			.catch((erro)=>{reject(erro)})
	})
}

function refreshConversas(){
	getConversas()
		.then((dados) => {
			console.log("conversas: "+JSON.stringify(dados));
			conversas = dados;
			for(i in conversas)
				for(j in users){
					if(conversas[i].participantes[0] == users[j]._id || conversas[i].participantes[1] == users[j]._id){
						users[j].id_conversa = conversas[i]._id;
						console.log("LALALALALLALAA")
						break;
					}
				}
		})

}

function getUser(id){
	//users.forEach(e => {console.log(e._id+" "+id);if(e._id == id) return e})
	for(i in users)
	if(users[i]._id == id) return users[i];
	console.log("FUDEU user: "+ id)
	console.log(users)
}

