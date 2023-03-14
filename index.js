const mysql = require('mysql2');
const express = require('express');
const bodyParser = require('body-parser');
const { query } = require('express');

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "agendamento"
});
connection.connect((err) => {
    if (err) {
      console.log(`Erro de conexão com o banco de dados: ${err}`);
      return;
    }
    console.log('Conexão estabelecida com sucesso!');
  });

const app = express();
app.use('/fontawesome-free-6.3.0-web/css', express.static(__dirname + '/fontawesome-free-6.3.0-web/css', {
    setHeaders: function (res, path, stat) {
      res.set('Content-Type', 'text/css')
    }
  }));
app.use(express.static(__dirname + '/css'));

function createTableHtml(results) {
  let tableHtml = '<table class="table-sales">';
  tableHtml += '<thead><tr><th>Data</th><th>Cliente</th><th>Status</th><th>Total</th></tr></thead>';
  tableHtml += '<tbody>';

  function formatDate(date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${day}/${month}/${year}`;
  }

  for (let i = 0; i < results.length; i++) {
    const data = new Date(results[i].data);
    const formattedDate = formatDate(data);
    tableHtml += '<tr>';
    tableHtml += '<td>' + formattedDate + '</td>';
    tableHtml += '<td>' + results[i].cliente + '</td>';
    tableHtml += '<td>' + results[i].status + '</td>';
    tableHtml += '<td>' + results[i].total + '</td>';
    tableHtml += '</tr>';
  }

  tableHtml += '</tbody></table>';

  return tableHtml;
}

app.get('/tabela', (req, res) => {
  const query = 'SELECT * FROM sua_tabela';
  console.log(query);
  connection.query(query, (error, results, fields) => {
    if (error) throw error;

    const tableHtml = createTableHtml(results);
    console.log(tableHtml);
    res.send(tableHtml);
  });
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

const server = app.listen(8000, () => {
  console.log('Servidor iniciado na porta 8000');
});

server.on('close', () => {
  connection.end();
  console.log('Conexão com o banco de dados encerrada.');
});
