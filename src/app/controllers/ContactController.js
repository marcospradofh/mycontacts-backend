const ContactsRepository = require('../repositories/ContactsRepository');

class ContactController {
  async index(request, response) {
    const { orderBy } = request.query;

    const contacts = await ContactsRepository.findAll(orderBy);
    response.json(contacts);
  }

  async show(request, response) {
    const { id } = request.params;

    const contact = await ContactsRepository.findById(id);

    if (!contact) {
      return response.status(404).json({ error: 'User not found🤦‍♂️' });
    }

    response.json(contact);
  }

  async store(request, response) {
    const {
      name, email, phone, category_id,
    } = request.body;

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const emailFounded = await ContactsRepository.findByEmail(email);

    if (emailFounded) {
      return response.status(400).json({ error: 'This email has already been registered' });
    }

    const contact = await ContactsRepository.create({
      name, email, phone, category_id,
    });

    response.json(contact);
  }

  async update(request, response) {
    const {
      name, phone, email, category_id,
    } = request.body;
    const { id } = request.params;

    const contactId = await ContactsRepository.findById(id);

    if (!contactId) {
      return response.status(404).json({ error: 'User not found 🤦‍♂️' });
    }

    if (!name) {
      return response.status(400).json({ error: 'Name is required' });
    }

    const emailFounded = await ContactsRepository.findByEmail(email);

    if (emailFounded && emailFounded.id !== id) {
      return response.status(400).json({ error: 'This email has already been registered' });
    }

    const contact = await ContactsRepository.update(id, {
      name, email, phone, category_id,
    });

    response.json(contact);
  }

  async delete(request, response) {
    const { id } = request.params;

    await ContactsRepository.delete(id);
    response.sendStatus(204);
  }
}

module.exports = new ContactController();
