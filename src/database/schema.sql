CREATE DATABASE mycontacts;

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS categories (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID NOT NULL UNIQUE DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR UNIQUE,
  phone VARCHAR,
  category_id UUID,
  FOREIGN KEY(category_id) REFERENCES categories(id)
);

-- As Foreign Keys servem para fazer a relação entre colunas de diferentes tabelas. São uma forma de validação que garante a integridade relacional.
-- As Primarys Keys, nesse caso, são os ID's. São endereços únicos da própria tabela para identificação dos registros.
-- VARCHAR são as strings de javascript.
-- O 'IF NOT EXISTS' É para evitar erros ao passar as instruções no terminal.
-- As colunas que iremos criar são passadas nos 'argumentos' do CREATE TABLE.
-- UUID = Universal Unique ID.
-- Os valores, são, por padrão, nullable (Ou seja, passíveis de serem nulo). Tal comportamento é evitado passando 'NOT NULL'. O Unique serve como validação de 'exclusividade'.
-- Default é quando, não passado, o valor vai ser gerado por padrão. O que vem depois dele, é como ele será gerado.
-- O 'Extension' é como se fosse o Require do CommonJS do Node.
