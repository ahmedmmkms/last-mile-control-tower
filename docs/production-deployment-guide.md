# Production Deployment Guide

This guide provides step-by-step instructions for deploying the Last-Mile Delivery Control Tower application to a production environment.

## Prerequisites

Before deploying to production, ensure you have:

1. A PostgreSQL database (Supabase recommended)
2. Node.js (version 16 or higher)
3. npm or yarn package manager
4. A domain name (optional but recommended)
5. SSL certificate (required for production)

## Environment Setup

### 1. Database Configuration

1. Create a PostgreSQL database using Supabase or your preferred provider
2. Run all database migrations:
   ```bash
   node src/database/migrate.js
   ```
3. (Optional) Run seed data script for demo data:
   ```bash
   node src/database/seed.js
   ```

### 2. Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# Database Configuration
DB_HOST=your-database-host.supabase.co
DB_PORT=5432
DB_NAME=your-database-name
DB_USER=your-database-user
DB_PASSWORD=your-database-password

# Deployment Configuration
NODE_ENV=production
PORT=3000
DEPLOYED_URL=https://your-domain.com

# Optional: SSL Configuration
SSL_CERT_PATH=/path/to/certificate.crt
SSL_KEY_PATH=/path/to/private.key
```

## Deployment Options

### Option 1: Vercel Deployment (Recommended)

1. Push your code to a GitHub repository
2. Connect your repository to Vercel
3. Set environment variables in the Vercel dashboard
4. Deploy the application

The application is already configured for Vercel deployment with the following settings:
- Build command: `npm run build-frontend`
- Output directory: `src/frontend/dist`
- Install command: `npm install`

### Option 2: Traditional Server Deployment

1. Clone the repository to your server:
   ```bash
   git clone https://github.com/your-repo/last-mile-control-tower.git
   cd last-mile-control-tower
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the frontend:
   ```bash
   npm run build-frontend
   ```

4. Start the application:
   ```bash
   npm start
   ```

For production, it's recommended to use a process manager like PM2:

```bash
# Install PM2 globally
npm install -g pm2

# Start the application with PM2
pm2 start index.js --name "last-mile-control-tower"

# Save the PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

### Option 3: Docker Deployment

1. Build the Docker image:
   ```bash
   docker build -t last-mile-control-tower .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name last-mile-control-tower \
     -p 3000:3000 \
     -e DB_HOST=your-database-host.supabase.co \
     -e DB_PORT=5432 \
     -e DB_NAME=your-database-name \
     -e DB_USER=your-database-user \
     -e DB_PASSWORD=your-database-password \
     last-mile-control-tower
   ```

## SSL Configuration

For production deployment, SSL is required for WebSocket connections. You can:

1. Use a reverse proxy like Nginx with SSL termination
2. Use a managed service like Vercel that provides SSL automatically
3. Configure SSL directly in the application (not recommended for production)

### Nginx Reverse Proxy Configuration

```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /path/to/your/certificate.crt;
    ssl_certificate_key /path/to/your/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /ws {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Monitoring and Logging

### Application Monitoring

The application includes built-in logging for:

1. Database connections
2. API requests
3. WebSocket connections
4. Error tracking

### Health Checks

The application provides a health check endpoint at `/api/health` that returns:

```json
{
  "status": "ok",
  "timestamp": "2023-01-01T00:00:00.000Z",
  "database": "connected",
  "dbTestDuration": "15ms",
  "dbResult": {
    "db_connected": 1
  }
}
```

### Performance Monitoring

For production monitoring, consider using:

1. Application Performance Monitoring (APM) tools like New Relic or DataDog
2. Log aggregation tools like ELK Stack or Splunk
3. Infrastructure monitoring tools like Prometheus and Grafana

## Security Considerations

### Authentication

The current implementation has no authentication for API endpoints. For production, implement:

1. JWT-based authentication for API endpoints
2. Rate limiting for API requests
3. Input validation and sanitization

### Data Protection

1. Use environment variables for sensitive configuration
2. Encrypt sensitive data at rest
3. Implement proper database access controls
4. Regularly backup your database

### Network Security

1. Restrict database access to application servers only
2. Use firewalls to limit access to necessary ports
3. Implement proper CORS policies
4. Use HTTPS for all communications

## Scaling Considerations

### Horizontal Scaling

For high-traffic environments:

1. Use a load balancer to distribute requests
2. Implement Redis adapter for Socket.IO
3. Use database connection pooling
4. Implement caching strategies

### Database Optimization

1. Add indexes for frequently queried fields
2. Implement read replicas for database scaling
3. Use connection pooling
4. Regularly maintain and optimize database performance

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify database credentials in `.env` file
   - Check network connectivity to database
   - Ensure database is accepting connections

2. **WebSocket Connection Issues**
   - Verify SSL configuration
   - Check CORS settings
   - Ensure proper proxy configuration for WebSocket upgrade

3. **Frontend Not Loading**
   - Verify frontend build completed successfully
   - Check static file serving configuration
   - Ensure proper routing configuration

### Logs and Debugging

Check application logs for errors:

```bash
# If using PM2
pm2 logs last-mile-control-tower

# If running directly
tail -f logs/app.log
```

## Maintenance

### Regular Tasks

1. Monitor application logs for errors
2. Check database performance and optimize queries
3. Update dependencies regularly
4. Backup database regularly
5. Monitor resource usage (CPU, memory, disk)

### Updates

To update the application:

1. Pull the latest code from repository
2. Install updated dependencies:
   ```bash
   npm install
   ```
3. Build the frontend:
   ```bash
   npm run build-frontend
   ```
4. Run database migrations if needed:
   ```bash
   node src/database/migrate.js
   ```
5. Restart the application:
   ```bash
   pm2 restart last-mile-control-tower
   ```

## Support

For issues with deployment, contact the development team or refer to the project documentation.