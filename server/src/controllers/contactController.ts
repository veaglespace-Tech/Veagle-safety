import { Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middleware/auth';

export const getContacts = async (req: AuthRequest, res: Response) => {
  try {
    const contacts = await prisma.trustedContact.findMany({
      where: { userId: req.user?.id },
      orderBy: { createdAt: 'asc' },
    });
    return res.json({ contacts });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch trusted contacts' });
  }
};

export const addContact = async (req: AuthRequest, res: Response) => {
  try {
    const { name, relationship, phone, email } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ error: 'Name and phone number are required' });
    }

    const contact = await prisma.trustedContact.create({
      data: {
        userId: req.user!.id,
        name,
        relationship: relationship || 'Family',
        phone,
        email: email || '',
        isVerified: true,
      },
    });

    return res.status(201).json({ message: 'Trusted contact added', contact });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to add contact' });
  }
};

export const deleteContact = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.trustedContact.deleteMany({
      where: { id, userId: req.user!.id },
    });
    return res.json({ message: 'Contact removed' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove contact' });
  }
};
