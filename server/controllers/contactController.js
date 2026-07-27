import { prisma } from '../config/prisma.js';

export const getContacts = async (req, res) => {
  try {
    const contacts = await prisma.trustedContact.findMany({
      where: { userId: req.user?.id },
      orderBy: { priorityOrder: 'asc' },
    });
    return res.json({ contacts });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch contacts' });
  }
};

export const addContact = async (req, res) => {
  try {
    const { name, relationship, phone, email } = req.body;

    if (!name || !relationship || !phone) {
      return res.status(400).json({ error: 'Name, relationship, and phone are required' });
    }

    const count = await prisma.trustedContact.count({ where: { userId: req.user?.id } });
    if (count >= 5) {
      return res.status(400).json({ error: 'Maximum limit of 5 trusted contacts reached' });
    }

    const contact = await prisma.trustedContact.create({
      data: {
        userId: req.user?.id,
        name,
        relationship,
        phone,
        email: email || '',
        priorityOrder: count + 1,
      },
    });

    return res.status(201).json({ message: 'Trusted contact added', contact });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add contact' });
  }
};

export const deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.trustedContact.deleteMany({
      where: {
        id,
        userId: req.user?.id,
      },
    });

    return res.json({ message: 'Contact removed successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove contact' });
  }
};
