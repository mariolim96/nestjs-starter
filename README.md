# NestJS Starter Project

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A comprehensive NestJS starter project with advanced logging, microservices infrastructure, and development tools pre-configured.</p>

## Description

This is a production-ready NestJS starter template that includes:

- **Advanced Logging System** - Custom [`LoggerService`](src/core/logger/logger.service.ts) with Winston integration and colorful console output
- **Request/Response Middleware** - Comprehensive HTTP logging with [`LoggerMiddleware`](src/core/logger/logger.middleware.ts)
- **Microservices Infrastructure** - Docker Compose setup with PostgreSQL, Redis, Kafka, Elasticsearch
- **Development Tools** - pgAdmin, Kafka UI, Redis Commander, Kibana
- **Security** - Helmet integration and input validation
- **Testing** - Unit and E2E test setup

## Features

### 🚀 Core Features
- **Enhanced Logging**: Request tracking, performance monitoring, and error handling
- **Response Transformation**: Standardized API responses with [`TransformResponseInterceptor`](src/core/interceptors/transform-response/transform-response.interceptor.ts)
- **Configuration Management**: Environment-based configuration with validation
- **Input Validation**: DTO validation using class-validator

### 🛠️ Infrastructure
- **PostgreSQL**: Main database with pgAdmin interface
- **Redis**: Caching and session management
- **Kafka**: Message broker for microservices communication
- **Elasticsearch**: Search engine and log aggregation
- **Docker Compose**: Complete development environment

### 📊 Monitoring & Development
- **Request ID Tracking**: Unique request identification across services
- **Performance Monitoring**: Response time categorization and alerts
- **Sensitive Data Filtering**: Automatic redaction of passwords and tokens
- **Development UIs**: Web interfaces for all services

## Project Setup

### Prerequisites
- Node.js (v18 or higher)
- pnpm
- Docker and Docker Compose

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd nest-start
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. **Start infrastructure services**
```bash
# Start all Docker services
docker-compose up -d

# Or use the setup script
chmod +x scripts/setup.sh
./scripts/setup.sh
```

5. **Create Kafka topics**
```bash
chmod +x scripts/kafka-topics.sh
./scripts/kafka-topics.sh
```

## Development

### Running the Application

```bash
# Development mode with hot reload
pnpm run start:dev

# Production mode
pnpm run start:prod

# Debug mode
pnpm run start:debug
```

### Testing

```bash
# Unit tests
pnpm run test

# E2E tests
pnpm run test:e2e

# Test coverage
pnpm run test:cov

# Watch mode
pnpm run test:watch
```

### Code Quality

```bash
# Linting
pnpm run lint

# Format code
pnpm run format
```

## Architecture

### Core Module Structure

```
src/
├── core/                           # Core functionality
│   ├── logger/                     # Advanced logging system
│   │   ├── logger.service.ts      # Winston-based logger service
│   │   └── logger.middleware.ts   # HTTP request/response logging
│   ├── interceptors/              # Global interceptors
│   │   └── transform-response/    # Response transformation
│   └── core.module.ts             # Core module configuration
├── config/                        # Configuration management
├── dto/                          # Data Transfer Objects
└── main.ts                       # Application bootstrap
```

### Logging Features

The [`LoggerService`](src/core/logger/logger.service.ts) provides:
- **Colorful Console Output**: Different colors for log levels
- **File Logging**: Separate error and combined log files
- **Metadata Support**: Structured logging with context and metadata
- **Performance Tracking**: Request timing and categorization

The [`LoggerMiddleware`](src/core/logger/logger.middleware.ts) includes:
- **Request ID Generation**: Unique tracking across requests
- **Sensitive Data Filtering**: Automatic redaction of credentials
- **Performance Monitoring**: Response time categorization
- **Status Code Logging**: Different log levels based on HTTP status

## Services Access

After running `docker-compose up -d`, access these services:

| Service | URL | Credentials |
|---------|-----|-------------|
| **PostgreSQL** | `localhost:5432` | `nestjs_user:nestjs_password` |
| **pgAdmin** | http://localhost:5050 | `admin@example.com:admin` |
| **Redis** | `localhost:6379` | Password: `redis_password` |
| **Redis Commander** | http://localhost:8081 | Auto-configured |
| **Kafka** | `localhost:9092` | No auth |
| **Kafka UI** | http://localhost:8080 | No auth |
| **Elasticsearch** | http://localhost:9200 | No auth |
| **Kibana** | http://localhost:5601 | No auth |
| **DBeaver** | http://localhost:8978 | `admin:admin` |

## API Endpoints

### Basic Endpoints

```typescript
// GET / - Health check
curl http://localhost:3000/

// POST / - Create user example
curl -X POST http://localhost:3000/ \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "secret123"}'
```

### Response Format

All API responses are transformed using [`TransformResponseInterceptor`](src/core/interceptors/transform-response/transform-response.interceptor.ts):

```json
{
  "data": "actual response data",
  "statusCode": 200
}
```

## Configuration

### Environment Variables

Key environment variables (see [.env.example](.env.example)):

```bash
# Application
NODE_ENV=development

# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=nestjs_chat
DATABASE_USER=nestjs_user
DATABASE_PASSWORD=nestjs_password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=redis_password

# Kafka
KAFKA_BROKERS=localhost:9092

# Logging
LOG_LEVEL=info
```

### Logger Configuration

The logging system automatically:
- Uses colorful console output in development
- Writes structured JSON logs in production
- Filters sensitive data from request bodies and headers
- Tracks request performance and categorizes response times

## Scripts

Useful scripts in the [`scripts/`](scripts/) directory:

- [`setup.sh`](scripts/setup.sh) - Complete infrastructure setup
- [`kafka-topics.sh`](scripts/kafka-topics.sh) - Create required Kafka topics

## Docker Services

The [`docker-compose.yml`](docker-compose.yml) includes:

### Core Services
- **PostgreSQL 15**: Primary database
- **Redis 7**: Caching and sessions
- **Kafka**: Message broker with Zookeeper

### Search & Analytics
- **Elasticsearch**: Search engine and log aggregation
- **Kibana**: Elasticsearch visualization

### Development Tools
- **pgAdmin**: PostgreSQL management interface
- **Kafka UI**: Kafka cluster management
- **Redis Commander**: Redis key-value browser
- **DBeaver**: Universal database tool

## Deployment

### Production Build

```bash
# Build the application
pnpm run build

# Start production server
pnpm run start:prod
```

### Docker Deployment

```bash
# Build and run with Docker
docker build -t nestjs-app .
docker run -p 3000:3000 nestjs-app
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run the test suite: `pnpm run test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/new-feature`
7. Submit a pull request

## Support

- [NestJS Documentation](https://docs.nestjs.com)
- [Discord Community](https://discord.gg/G7Qnnhy)
- [GitHub Issues](../../issues)

---

**Happy coding! 🚀**