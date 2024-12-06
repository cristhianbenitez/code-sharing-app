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
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let client;
  try {
    const { code, language } = req.body;

    // Validate input
    if (!code || typeof code !== 'string') {
      return res.status(400).json({
        message: 'Invalid code format',
        details: 'Code must be a non-empty string'
      });
    }

    // Get client instance
    client = prisma;

    // Test database connection first
    try {
      await client.$connect();
      console.log('Database connection successful');
    } catch (connectionError) {
      console.error('Database connection error:', {
        error: connectionError.message,
        name: connectionError.name,
        code: connectionError.code,
        env: process.env.NODE_ENV,
        dbUrl: process.env.POSTGRES_PRISMA_URL ? 'Set' : 'Not Set'
      });
      return res.status(500).json({
        message: 'Database connection failed',
        details: process.env.NODE_ENV === 'development' ? connectionError.message : undefined
      });
    }

    // Create session with detailed error logging
    const session = await client.codeSession.create({
      data: {
        code: code || '// Write your code here',
        language: language || 'javascript'
      }
    });

    // Validate session creation
    if (!session?.id) {
      console.error('Session creation failed - invalid session:', {
        session,
        env: process.env.NODE_ENV
      });
      return res.status(500).json({
        message: 'Failed to create valid session',
        details: 'Session object is invalid'
      });
    }

    // Log success with relevant details
    console.log('Session created successfully:', {
      sessionId: session.id,
      env: process.env.NODE_ENV,
      timestamp: new Date().toISOString()
    });

    return res.status(200).json({
      sessionId: session.id,
      message: 'Session created successfully'
    });

  } catch (error) {
    console.error('Error creating session:', {
      error: error.message,
      stack: error.stack,
      name: error.name,
      env: process.env.NODE_ENV,
      prismaError: error?.code,
      timestamp: new Date().toISOString()
    });

    // Handle specific Prisma errors
    if (error?.code === 'P2002') {
      return res.status(409).json({
        message: 'Session already exists'
      });
    }

    return res.status(500).json({
      message: 'Error creating session',
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
