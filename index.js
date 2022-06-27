const express = require("express");
//MongoClient, ObjectID
const { MongoClient, ObjectId } = require("mongodb");

const url = "mongodb://localhost:27017";
const dbName = "ocean_bancodedados_07_08_2022"

async function main() {
console.log("Conectando ao Banco de dados...")

//conexão com o banco de dados
const client = await MongoClient.connect(url);

const db = client.db(dbName);


const collection = db.collection("herois")

console.log("Conexão realizada com sucesso ");

//Aplicação Backend com Express 

const app = express();


// Informar para o Express que estamos usando JSON
// no body das requisições
app.use(express.json());

app.get("/", function (req, res) {
  res.send("Hello World");
});

const herois = ["Mulher Maravilha", "Capitã Marvel", "Homem de Ferro"];

// Endpoint Read All - [GET] /herois
app.get("/herois", async function (req, res) {
  const documentos = await collection.find().toArray()

  res.send(documentos);
});

// Endpoint Read by ID - [GET] /herois/:id
app.get("/herois/:id", async function (req, res) {
  const id = req.params.id;

  const item = await collection.findOne({ _id: new ObjectId(id)});

  res.send(item);
});

// Endpoint Create - [POST] /herois
app.post("/herois", async function (req, res) {
  // Acessa o nome do herói no corpo da requisição
  const item = req.body;


// Insere o nome na lista
  // herois.push(item);
  /** */
  //insere o objeto na collection
  await collection.insertOne(item)

  res.send(item);
});

//Endpoint Update - [PUT] /herois/:id
app.put("/herois/:id" , function(req,res){
  //obtemos o ID pela rota
  const id = req.params.id;
  
  //Pegamos o nome que foi enviado no corpo
  const item = req.body;

  //Atualizamos o ID para iniciar do 1
  // herois[id - 1] = item
  //atualizamos a collection usando o IDm colocando o novo item
  collection.updateOne(
    //filtro
    { _id: new ObjectId(id)},
    //operação de atualização 
    { $set: item }
  );

  res.send(item)
});

//Endpoint Delete - [DELETE] /herois/:id
app.delete("/herois/:id", async function (req,res) {
  //obtemos o ID pela rota
  const id = req.params.id;
  //removemos a posição id - da lista
  // delete herois [id - 1]

  //removemos o documento pelo id 
  await collection.deleteOne({ _id: new ObjectId(id)})
  res.send("Item Removido.");
} )

app.listen(3000, () =>
  console.log("Servidor rodando em http://localhost:3000")
);
};

main();