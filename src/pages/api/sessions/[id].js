import { PrismaClient } from '@prisma/client';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
const globalForPrisma = global;

const prisma = globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
    errorFormat: 'pretty',
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default async function handler(req, res) {
  const { id } = req.query;

  // Validate session ID
  if (!id || id === 'undefined') {
    return res.status(400).json({
      message: 'Invalid session ID',
      details: 'Session ID is required'
    });
  }

  let client;
  try {
    client = prisma;

    if (req.method === 'GET') {
      // Test database connection first
      try {
        await client.$connect();
      } catch (connectionError) {
        console.error('Database connection error:', {
          error: connectionError.message,
          name: connectionError.name,
          code: connectionError.code,
          env: process.env.NODE_ENV
        });
        return res.status(500).json({ message: 'Database connection failed' });
      }

      const session = await client.codeSession.findUnique({
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

      const session = await client.codeSession.update({
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
      stack: error.stack,
      name: error.name,
      env: process.env.NODE_ENV,
      prismaError: error?.code,
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
    // Only disconnect in development
    if (process.env.NODE_ENV !== 'production' && client) {
      try {
        await client.$disconnect();
      } catch (disconnectError) {
        console.error('Error disconnecting from database:', disconnectError);
      }
    }
  }
}
