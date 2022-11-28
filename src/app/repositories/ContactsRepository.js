// O repository é o meio do caminho entre o Controller e o database. É chamado Repository Pattern.
// É feito assim por convenção, para caso haja alteração no database, apenas será
// necessária a refatoração do código do repository, e não de todo o código.
// Regras de negócio ficam no Controller, e o repository NÃO têm de conhecê-la.
// A única responsabilidade do repository é acessar e conhecer o data source.

const db = require('../../database'); // Pega o Index.js de Database

class ContactsRepository {
  // Método/função em async automaticamente retorna uma promise
  // OrderBY recebe por padrão o valor ASC, podendo ser sobrescrito na chamada do Controller
  async findAll(orderBy = 'ASC') {
    // Asc, para letras, é o mesmo que alfabético.
    // Aqui, não conseguimos usar as Bind Variables. Tem que ser por interpolação mesmo
    // pois não se atribui valor na query, como se fosse name = $1
    // JOIN faz a ligação das tabelas. Temos o nome da tabela antes para evitar erro de ambiguidade.
    // Existem vários tipos de Join's. O padrão é o inner.
    // INNER JOIN -> Retorna apenas as rows que tem relacionamento entre as duas tabelas;
    // LEFT JOIN -> Retorna todos os registros da tabela da esquerda + os de relacionamento;
    // RIGHT JOIN -> Retorna todos os registros da tabela da direita + os de relacionamento;
    // FULL JOIN -> Retorna todos os registro, independente do relacionamento.
    // PS. O Left é sempre a tabela do FROM, e o Right a do Join
    // O 'AS' nós usamos para 'sobrescrever' uma coluna que queremos. Também evita ambiguidade.
    const direction = orderBy.toUpperCase() === 'DESC' ? 'DESC' : 'ASC'; // Aqui o orderBy é tratado antes para evitar erros e golpes de SQL Injection.
    const rows = await db.query(`
    SELECT contacts.*, categories.name AS category_name
    FROM contacts
    LEFT JOIN categories ON categories.id = contacts.category_id
    ORDER BY contacts.name ${direction}`);
    return rows;
  }

  async findById(id) {
    const [row] = await db.query(`
    SELECT contacts.*, categories.name AS category_name
    FROM contacts
    LEFT JOIN categories ON categories.id = contacts.category_id
    WHERE contacts.id = $1`, [id]);
    return row;
  }

  async findByEmail(email) {
    const [row] = await db.query('SELECT * FROM contacts WHERE email = $1', [email]);
    return row;
  }

  async create({
    name, email, phone, category_id,
  }) {
    // Pega o primeiro elemento do array que vem como resposta da query,
    // e o desestrutura para  a variável row
    // $1, $2... São os Bind Variables do próprio PG,
    // para evitar ataques como de SQL Injection.
    // O Array após essas variáveis é para atribuir-lhes valor.
    // O Returning é para retornar o valor. O * é um alias para 'ALL'.
    const [row] = await db.query(`
    INSERT INTO contacts(name, email, phone, category_id)
    VALUES($1, $2, $3, $4)
    RETURNING *
    `, [name, email, phone, category_id]);

    return row;
  }

  async update(id, {
    name, email, phone, category_id,
  }) {
    const [row] = await db.query(`
    UPDATE contacts
    SET name = $1, email = $2, phone = $3, category_id = $4
    WHERE id = $5
    RETURNING *
    `, [name, email, phone, category_id, id]);
    return row;
  }

  async delete(id) {
    // Não chamamos de row e nem aplicamos a desestruturação, pois na operaçào de
    // delete, nos é retornado um array vazio. [row] resultaria em undefined
    const deleteOp = await db.query('DELETE FROM contacts WHERE id = $1', [id]);
    return deleteOp;
  }
}

module.exports = new ContactsRepository();
