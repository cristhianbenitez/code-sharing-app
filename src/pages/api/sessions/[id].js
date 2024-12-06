import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const session = await prisma.codeSession.findUnique({
        where: { id }
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      res.status(200).json(session);
    } catch (error) {
      console.error('Error fetching session:', error);
      res.status(500).json({ message: 'Error fetching session' });
    }
  } else if (req.method === 'PUT') {
    try {
      const { code, language } = req.body;
      const session = await prisma.codeSession.update({
        where: { id },
        data: { code, language }
      });

      res.status(200).json(session);
    } catch (error) {
      console.error('Error updating session:', error);
      res.status(500).json({ message: 'Error updating session' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
