// node mongoexport.js --db dbName --collection collectionName --file fileName.json


const fs = require('fs');

var MongoClient = require('mongodb').MongoClient;

var url = "mongodb://localhost:27017/";

var args = process.argv.slice(2)

if(args[0] == '--db' && args[2] == "--collection" && args[4] == '--file'){
    var dbName = args[1]

    var collectionName = args[3]

    var file = args[5]

    if(file != null && file.match('.*[.]json')){
        
        console.log('DataBase Name: ' + dbName + '\nCollection Name: ' + collectionName + '\njsonFile: ' + file)

        exportaDados(dbName, collectionName, file)
                  
     }
      else console.log('O ficheiro destino deverá ser do tipo JSON!\n')
    
}
else console.log('Não passou os argumentos corretos!\nDeverá ter o seguinte formato: node mongoexport.js --db dbName --collection collectionName --file fileName.json')


function exportaDados(dbName, collectionName ,file){
    
      MongoClient.connect(url,  {useNewUrlParser: true,  useUnifiedTopology: true },function(err, db) {
        if (err) throw err;
        var dbo = db.db(dbName);
        dbo.collection(collectionName).find({}).toArray(function(err, result) {
          if (err) throw err;
          fs.writeFile(file, JSON.stringify(result), function(err) {

            if(err) {
                return console.log(err);
            }
        
            console.log("Os dados foram gravados com sucesso!");
        });
          console.log(result);
          db.close();
        });
      });

}
