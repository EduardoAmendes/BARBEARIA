const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agendamento"
});


// Testa a conexão com o banco de dados
connection.connect((error) => {
  if (error) {
    console.error('Ocorreu um erro ao conectar-se ao banco de dados:', error);
  } else {
    console.log('Conexão bem-sucedida ao banco de dados!');
  }
});

// Cria um objeto do tipo Express
const app = express();

// Utiliza o middleware body-parser para processar o corpo da requisição
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Define a rota /cadastro

app.post('/cadastro', async (req, res) => {
  const pessoa = req.body;
  const cortesSelecionados = req.body.corte;


  try{
      for (const corteSelecionado of cortesSelecionados) {
          // Extrai o nome e o preço do corte selecionado
          const [nomeCorte, precoString] = corteSelecionado.split(' - ');
          const preco = parseFloat(precoString.replace(/[^\d.]/g, '')) / 100;
  

          await connection.execute(
              'INSERT INTO agendamentos (nome, telefone, data, corte, preco, status, horario) VALUES (?, ?, ?, ?, ?, ?,?)',
              [pessoa.nome, pessoa.telefone, pessoa.data, nomeCorte, preco, pessoa.status, pessoa.horario],
          );
      }
      res.send('Preços salvos com sucesso!');
  } catch (err) {
    console.error(err);
    res.send('Erro ao salvar preços.');
  }
});
  


// Define o diretório raiz para arquivos estáticos
app.use(express.static(__dirname + '/css'));

// Define a rota para exibir o formulário
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/agendamento.html');
});

// Inicia o servidor na porta 3000
app.listen(3000, () => {
  console.log('Servidor iniciado na porta 3000');
});
