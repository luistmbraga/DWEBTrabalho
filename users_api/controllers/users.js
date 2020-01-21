var User = require('../models/users')


module.exports.listarTodosUsers = () => {
    return User.find().exec()
}

module.exports.consultarUserId = id => {
    return User.find({_id: id}).exec()
}

module.exports.gruposUserId = id => {
    return User.find({_id: id},{_id: false, grupos: true}).exec()
}

module.exports.inserirUser = dados => {
    var user = new User(dados);
    console.log(user);

    user.save(function (err, u) {
        if (err) return console.error(err);
        else console.log('Foi inserido com sucesso.')
    })
}

module.exports.apagarUser = id => {
    User
    .deleteOne({_id: id}, (err, u) => {
        if (err) return console.error(err);
        else
        console.log('Foi apagado com sucesso.')
    })   
}

module.exports.atualizarUser = (id, dados) => {

    User.updateOne({_id: id}, {$set: dados}, (err, u) =>{
        if (err) return console.error(err);
        else
        console.log('Foi atualizado com sucesso.')
    });
}

module.exports.insereGrupoUser = (id, grupo) => {
    User.updateOne({ _id: id },{ $push: { grupos: grupo } }, (err, u) =>{
        if(err) return console.error(err);
        else
        console.log('Grupo foi inserido no user com sucesso.')
    });
}