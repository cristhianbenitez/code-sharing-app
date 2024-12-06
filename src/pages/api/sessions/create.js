import { PrismaClient } from '@prisma/client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
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
    const { code, language } = req.body;

    // Validate input
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        message: 'Invalid code format',
        details: 'Code must be a non-empty string'
      });
    }

    // Create session
    const session = await prisma.codeSession.create({
      data: {
        code,
        language: language || 'javascript'
      }
    });

    return res.status(200).json({
      sessionId: session.id,
      message: 'Session created successfully'
    });

  } catch (error) {
    console.error('Session creation error:', {
      message: error.message,
      name: error.name,
      code: error?.code,
      timestamp: new Date().toISOString()
    });

    return res.status(500).json({
      message: 'Error creating session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Always disconnect the client
    await prisma.$disconnect();
  }
}
