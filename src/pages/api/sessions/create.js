import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

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

    // Test database connection first
    try {
      await prisma.$connect();
    } catch (connectionError) {
      console.error('Database connection error:', {
        error: connectionError.message,
        name: connectionError.name,
        code: connectionError.code
      });
      return res.status(500).json({ message: 'Database connection failed' });
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
    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating session:', {
      error: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({
      message: 'Error creating session',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    // Don't disconnect in production as we're using a singleton
    if (process.env.NODE_ENV !== 'production') {
      await prisma.$disconnect();
    }
  }
}
