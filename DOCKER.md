# Docker Guide for NestJS Application

This guide explains how to run the NestJS application using Docker.

## Files Overview

- `Dockerfile` - Multi-stage Docker build configuration
- `docker-compose.yml` - Development environment with hot reload
- `docker-compose.prod.yml` - Production environment
- `.dockerignore` - Files to exclude from Docker builds

## Quick Start

### Development Mode
```bash
# Start all services (PostgreSQL, Redis, NestJS app) in development mode
pnpm run docker:dev

# Or using docker-compose directly
docker-compose up --build
```

### Production Mode
```bash
# Start all services in production mode
pnpm run docker:prod

# Or using docker-compose directly
docker-compose -f docker-compose.prod.yml up --build
```

## Available Docker Scripts

```bash
# Build Docker image
pnpm run docker:build

# Build production Docker image
pnpm run docker:build:prod

# Start development environment
pnpm run docker:dev

# Start production environment
pnpm run docker:prod

# Stop development environment
pnpm run docker:down

# Stop production environment
pnpm run docker:down:prod

# View application logs
pnpm run docker:logs
```

## Docker Configuration

### Development Environment
- **Hot reload**: Code changes are automatically reflected
- **Volume mounting**: Source code is mounted for live editing
- **Debug friendly**: Includes dev dependencies and debug tools

### Production Environment
- **Optimized**: Multi-stage build for smaller image size
- **Security**: Runs as non-root user
- **Health checks**: Built-in health monitoring
- **Production ready**: Only production dependencies included

## Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_NAME=nestjs_db
DATABASE_USER=nestjs_user
DATABASE_PASSWORD=nestjs_password
DATABASE_PORT=5432

# Redis
REDIS_PORT=6379
REDIS_PASSWORD=redis_password
```

## Accessing Services

When running with Docker Compose:

- **NestJS App**: http://localhost:3000
- **Health Check**: http://localhost:3000/health
- **API Documentation**: http://localhost:3000/api
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Redis Commander**: http://localhost:8081

## Health Monitoring

The application includes health check endpoints:

- `/health` - Basic application health
- `/cache/health` - Cache service health
- `/cache/health/simple` - Simple cache health check

## Troubleshooting

### Port Conflicts
If you get port conflicts, update the ports in docker-compose files:

```yaml
ports:
  - "3001:3000"  # Changed from 3000:3000
```

### Permission Issues
On Linux/macOS, you might need to fix file permissions:

```bash
sudo chown -R $USER:$USER .
```

### Container Logs
View logs for debugging:

```bash
# All services
docker-compose logs

# Specific service
docker-compose logs app

# Follow logs
docker-compose logs -f app
```

### Database Connection Issues
Ensure the database is ready before the app starts:

```bash
# Check if PostgreSQL is running
docker-compose exec postgres pg_isready -U nestjs_user

# Check Redis
docker-compose exec redis redis-cli ping
```

## Building for Different Architectures

For ARM-based systems (Apple M1/M2):

```bash
docker build --platform linux/amd64 -t nestjs-app .
```

## Security Notes

- The production image runs as a non-root user
- Only necessary files are included in the final image
- Environment variables should be properly secured
- Consider using Docker secrets for sensitive data in production