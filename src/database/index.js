// pg Serve para fazer a integração do Node com o Postgres
const { Client } = require('pg');

// Client é do PG, e faz a ligação ao nosso banco de dados Postgres
const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'root',
  password: 'root',
  database: 'mycontacts',
});

// Startamos o Client
client.connect();

// Exports é um objeto json. Fazer como abaixo, nada mais é que dar um atributo
// chamado 'query' para ele, e poder importá-lo depois.
exports.query = async (query, values) => {
  const { rows } = await client.query(query, values);
  return rows;
};
