const express = require('express');

const cors = require('./app/middlewares/cors');
const errorHandler = require('./app/middlewares/errorHandler');
const routes = require('./routes');

// É só inserí-lo. Serve para dar a capacidade do express e seus errors
// handlers tratarem erros de métodos assíncronos.
require('express-async-errors');

const app = express(); // Inicializa o express

// Um middleware nativo para capturar o body das requisições.
// É um body parser, como fizemos no primeiro módulo (captura o body e transforma em json)
app.use(express.json());

app.use(cors);

app.use(routes); // Método para usar as rotas de routes.js

// É um Middleware Error Handler. Por isso os NECESSÁRIOS 4 argumentos.
// Tem que vir depois das rotas, pois a ordem dos middlewares importa.
// Como seu primeiro argumento é "error", o Express já sabe que ele é um Error Handler
app.use(errorHandler);

app.listen(3001, () => console.log('Servidor iniciado!')); // Método nativo para iniciar
