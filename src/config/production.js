export const productionConfig = {
  database: {
    poolSize: 20,
    ssl: process.env.NODE_ENV === 'production',
    connectionTimeout: 60000,
  },
  cache: {
    ttl: 3600,
  },
  security: {
    rateLimitRequests: parseInt(process.env.RATE_LIMIT_REQUESTS || '100'),
    rateLimitDuration: parseInt(process.env.RATE_LIMIT_DURATION || '60'),
  }
}; 
