# Deployment Guide

## Prerequisites

- PostgreSQL database (e.g., Supabase, Railway, or your own server)
- Node.js hosting platform (e.g., Vercel, Railway, or your own server)
- Domain name (optional)

## Step 1: Database Setup

1. Set up a PostgreSQL database in production:
   - Use a managed service like Supabase or Railway
   - Or set up your own PostgreSQL server

2. Get your production database URL in this format:
```
postgresql://username:password@host:port/database
```

## Step 2: Environment Setup

1. Set up the following environment variables in your hosting platform:

```env
# Required
DATABASE_URL="your-production-database-url"
NEXT_PUBLIC_APP_URL="https://your-domain.com"

# Optional but recommended
NODE_ENV="production"
```

2. Security recommendations:
   - Use strong, unique passwords
   - Enable SSL for database connections
   - Restrict database access to your application's IP
   - Enable connection pooling if available

## Step 3: Database Migration

Run the production migration:

```bash
# Generate the migration
npx prisma generate

# Run the migration
npx prisma migrate deploy
```

## Step 4: Build and Deploy

### Option 1: Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

Vercel will automatically:
- Install dependencies
- Build the application
- Deploy to production
- Provide SSL/TLS
- Enable edge caching

### Option 2: Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Step 5: Post-Deployment

1. Set up monitoring:
   - Configure error tracking (e.g., Sentry)
   - Set up performance monitoring
   - Enable logging

2. Security measures:
   - Enable HTTPS
   - Set up CORS policies
   - Configure rate limiting
   - Enable DDoS protection

3. Performance optimization:
   - Enable caching
   - Configure CDN
   - Optimize database queries

## Production Checklist

- [ ] Database is properly secured
- [ ] Environment variables are set
- [ ] SSL/TLS is enabled
- [ ] Database migrations are applied
- [ ] Error tracking is configured
- [ ] Rate limiting is enabled
- [ ] CORS is configured
- [ ] Backups are automated
- [ ] Monitoring is set up
- [ ] Performance is optimized

## Maintenance

1. Regular updates:
   ```bash
   # Update dependencies
   npm update

   # Check for security vulnerabilities
   npm audit
   ```

2. Database maintenance:
   ```bash
   # Backup database regularly
   pg_dump your_database > backup.sql

   # Monitor database performance
   ```

3. Monitor application health:
   - Check error logs
   - Monitor performance metrics
   - Review security alerts

## Troubleshooting

Common issues and solutions:

1. Database connection issues:
   - Check connection string
   - Verify IP allowlist
   - Check SSL requirements

2. Build failures:
   - Verify dependencies
   - Check build logs
   - Ensure environment variables are set

3. Performance issues:
   - Monitor database queries
   - Check server resources
   - Review API response times

## Useful Commands

```bash
# Check application status
npm run start

# View logs
npm run logs

# Run database migrations
npx prisma migrate deploy

# Verify database connection
npx prisma db pull

# Build application
npm run build
```
