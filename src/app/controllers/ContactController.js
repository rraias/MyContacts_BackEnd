// O controller chama o repository, que acessa o banco de dados.
// Só precisa conhecer o repository, e não o data source e suas regras de implementação.

const ContactsRepository = require('../repositories/ContactsRepository');

// Os nomes são todos de convenção geral (index. show, store, update e delete).
class ContactController {
  async index(request, response) {
    // Listar todos os registros
    const { orderBy } = request.query; // Objeto do próprio express para pegar as querys da URL
    const allContacts = await ContactsRepository.findAll(orderBy);

    response.json(allContacts);
  }

  async show(request, response) {
    // Obter um registro
    const { id } = request.params; // Captura o Id passado no request da rota.
    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'Contact Not Found' }); // 404: Not Found
    }

    response.json(contact);
  }

  async store(request, response) {
    // Criar um novo registro
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const contactExists = await ContactsRepository.findByEmail(email);

    if (contactExists) {
      return response.status(400).json({ error: 'This e-mail is already in use' });
    }

    const contact = await ContactsRepository.create({
      name, email, phone, category_id,
    });

    response.status(201).json(contact);
  }

  async update(request, response) {
    // Editar um registro
    const { id } = request.params;
    const {
      name, email, phone, category_id,
    } = request.body;

    const contactExists = await ContactsRepository.findById(id);

    if (!contactExists) {
      return response.status(404).json({ error: 'Contact not Found' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const contactByEmail = await ContactsRepository.findByEmail(email);

    if (contactByEmail && contactByEmail.id !== id) {
      return response.status(400).json({ error: 'This e-mail is already in use' });
    }

    const contact = await ContactsRepository.update(id, {
      name, email, phone, category_id,
    });

    response.json(contact);
  }

  async delete(request, response) {
    // Deletar um registro
    const { id } = request.params;

    await ContactsRepository.delete(id);
    response.sendStatus(204); // 204: No content
  }
}

// Singleton Pattern => Exportamos uma instância de ContactController, e não a classe inteira.
module.exports = new ContactController();

// A diferença de argumentos e parâmetros é que argumentos são o que passamos na chamada da função
// E parâmetros é o que a função pode receber, que passamos em sua criação
