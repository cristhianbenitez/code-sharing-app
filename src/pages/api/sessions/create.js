import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { code, language } = req.body;

    // Validate input
    if (typeof code !== 'string') {
      return res.status(400).json({ message: 'Invalid code format' });
    }

    // Create session with detailed error logging
    const session = await prisma.codeSession.create({
      data: {
        code: code || '// Write your code here',
        language: language || 'javascript'
      }
    }).catch(error => {
      console.error('Prisma error details:', {
        name: error.name,
        code: error.code,
        message: error.message,
        meta: error.meta
      });
      throw error;
    });

    // Validate session creation
    if (!session || !session.id) {
      console.error('Session creation failed - invalid session:', session);
      return res.status(500).json({ message: 'Failed to create valid session' });
    }

    console.log('Session created successfully:', { sessionId: session.id });
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating session:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    res.status(500).json({
      message: 'Error creating session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Ensure connection is properly handled
    await prisma.$disconnect();
  }
}
