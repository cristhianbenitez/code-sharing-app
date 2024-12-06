import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  const { id } = req.query;

  // Validate session ID
  if (!id || id === 'undefined') {
    return res.status(400).json({
      message: 'Invalid session ID',
      details: 'Session ID is required'
    });
  }

  // Create a new PrismaClient instance for this request
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.POSTGRES_URL_NON_POOLING
      }
    }
  });

  try {
    if (req.method === 'GET') {
      const session = await prisma.codeSession.findUnique({
        where: { id }
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      return res.status(200).json(session);
    } else if (req.method === 'PUT') {
      const { code, language } = req.body;

      if (!code || typeof code !== 'string') {
        return res.status(400).json({
          message: 'Invalid code format',
          details: 'Code must be a non-empty string'
        });
      }

      const session = await prisma.codeSession.update({
        where: { id },
        data: { code, language }
      });

      return res.status(200).json(session);
    } else {
      return res.status(405).json({ message: 'Method not allowed' });
    }
  } catch (error) {
    console.error('Error handling session:', {
      error: error.message,
      name: error.name,
      code: error?.code,
      timestamp: new Date().toISOString()
    });

    if (error?.code === 'P2025') {
      return res.status(404).json({ message: 'Session not found' });
    }

    return res.status(500).json({
      message: 'Error handling session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Always disconnect the client
    await prisma.$disconnect();
  }
}
