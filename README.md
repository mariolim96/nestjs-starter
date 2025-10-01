# NestJS Advanced Starter Project

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">A production-ready NestJS starter template with enterprise-grade features including advanced logging, caching, database management, comprehensive testing, and a complete CI/CD pipeline.</p>

## 🚀 Features

### Core Infrastructure
- **Advanced Logging System** - Custom [`LoggerService`](src/core/logger/logger.service.ts) with Winston integration and performance monitoring
- **Request/Response Middleware** - Comprehensive HTTP logging with [`LoggerMiddleware`](src/core/logger/logger.middleware.ts)
- **Caching Layer** - Redis-based caching with health monitoring via [`CacheService`](src/core/cache/cache.service.ts)
- **Database Management** - Drizzle ORM with PostgreSQL and automated migrations
- **Response Transformation** - Standardized API responses via [`TransformResponseInterceptor`](src/core/interceptors/transform-response/transform-response.interceptor.ts)

### Development & Production
- **Docker Ecosystem** - Complete development environment with PostgreSQL, Redis, Kafka, Elasticsearch
- **Development Tools** - pgAdmin, Redis Commander, Kafka UI, Kibana, DBeaver
- **Security** - Helmet integration, input validation, and comprehensive security scanning
- **Testing Infrastructure** - Unit, integration, and E2E tests with coverage reporting
- **API Documentation** - Auto-generated Swagger documentation

### CI/CD Pipeline
- **18 Specialized Workflows** - Each with single responsibility for maintainability
- **Multi-environment Deployment** - Staging and production environments
- **Security First** - Multiple security scanning layers and dependency monitoring
- **Automated Maintenance** - Dependency updates, security monitoring, and cleanup

## 📁 Project Structure

```
src/
├── core/                    # Core application infrastructure
│   ├── cache/              # Redis caching service and health checks
│   ├── interceptors/       # Global interceptors (response transformation)
│   └── logger/             # Advanced logging with Winston
├── config/                  # Environment-based configuration
├── database/               # Database configuration and schemas
│   ├── schema/             # Drizzle ORM schemas (users, channels, etc.)
│   └── database.service.ts # Database connection service
├── users/                  # User management module
│   ├── dto/               # Data transfer objects
│   └── users.controller.ts # REST API endpoints
└── app.module.ts          # Main application module
```

## 🚦 Quick Start

### Prerequisites
- Node.js 22.x
- pnpm 9.x
- Docker and Docker Compose

### Installation

1. **Clone and setup**
   ```bash
   git clone <repository-url>
   cd nest-start
   cp .env.example .env
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

Optional services (uncomment in docker-compose.yml):
- **Kafka UI** | http://localhost:8080 | No auth |
- **Elasticsearch** | http://localhost:9200 | No auth |
- **Kibana** | http://localhost:5601 | No auth |

## 🛠️ Development

### Available Scripts

```bash
# Development
pnpm run start:dev          # Start with Docker services and hot reload
pnpm run start:debug        # Debug mode
pnpm run build              # Production build
pnpm run start:prod         # Production mode

# Database
pnpm run db:generate        # Generate Drizzle migrations
pnpm run db:migrate         # Run migrations
pnpm run db:push           # Push schema to database
pnpm run db:studio         # Open Drizzle Studio

# Testing
pnpm run test              # Unit tests
pnpm run test:watch        # Watch mode
pnpm run test:cov          # Coverage report
pnpm run test:e2e          # End-to-end tests

# Code Quality
pnpm run lint              # ESLint with auto-fix
pnpm run format            # Prettier formatting
pnpm run ci:validate       # Full CI validation locally
```

### Database Schema

The project includes a comprehensive database schema for a chat/collaboration platform:

- [`users`](src/database/schema/users.schema.ts) - User management
- [`channels`](src/database/schema/channels.schema.ts) - Chat channels
- [`messages`](src/database/schema/messages.schema.ts) - Chat messages
- [`kanbanBoards`](src/database/schema/kanban-boards.schema.ts) - Project management
- [`externalEvents`](src/database/schema/externalEvents.schema.ts) - External integrations

## 🔧 Configuration

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

# External Integrations
JIRA_API_URL=https://your-domain.atlassian.net
TRELLO_API_KEY=your-trello-api-key
DEEPL_API_KEY=your-deepl-api-key
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

See [DOCKER.md](DOCKER.md) for comprehensive Docker deployment guide.

```bash
# Production deployment
docker-compose -f docker-compose.prod.yml up -d

# Or build custom image
docker build -t nestjs-app .
docker run -p 3000:3000 nestjs-app
```

## 🔄 CI/CD Pipeline

The project includes 18 specialized GitHub Actions workflows. See [CICD.md](CICD.md) for complete documentation.

### Key Workflows
- **Code Quality**: Linting, testing, security scanning
- **Build & Deploy**: Docker building, security scanning, multi-environment deployment
- **Automation**: Auto-labeling, PR analysis, dependency updates
- **Maintenance**: Cleanup, monitoring, statistics

### Branch Protection

Configure these required status checks:
- 🔍 ESLint & Prettier
- 🧪 Unit & E2E Tests  
- 🔒 Dependency Security Scan
- 🔍 CodeQL Analysis
- 🐳 Build & Push Docker Image

## 📊 API Endpoints

### Users API
- `GET /users` - List all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PATCH /users/:id` - Update user
- `DELETE /users/:id` - Delete user

### Cache API
- `GET /cache/health` - Cache health status
- `POST /cache/set` - Set cache value
- `GET /cache/get/:key` - Get cache value
- `DELETE /cache/del/:key` - Delete cache value

### Health Checks
- `GET /health` - Application health
- `GET /cache/health/simple` - Simple cache health

## 🧪 Testing

The project includes comprehensive testing:

- **Unit Tests**: Service and controller testing with mocks
- **Integration Tests**: Database and external service integration
- **E2E Tests**: Full application workflow testing
- **Coverage Reports**: Automated coverage tracking and reporting

Example test files:
- [`users.controller.spec.ts`](src/users/users.controller.spec.ts)
- [`users.service.spec.ts`](src/users/users.service.spec.ts)

## 📚 Additional Documentation

- [Docker Guide](DOCKER.md) - Complete Docker setup and deployment
- [CI/CD Documentation](CICD.md) - Comprehensive CI/CD pipeline guide
- [Project Architecture](project-info.md) - Detailed system architecture
- [Setup Scripts](scripts/) - Utility scripts for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Make your changes and add tests
4. Run the test suite: `pnpm run test`
5. Run CI validation: `pnpm run ci:validate`
6. Commit your changes: `git commit -am 'Add new feature'`
7. Push to the branch: `git push origin feature/new-feature`
8. Submit a pull request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure CI/CD pipeline passes
- Use conventional commit messages

## 🔗 Resources

- [NestJS Documentation](https://docs.nestjs.com)
- [Drizzle ORM](https://orm.drizzle.team)
- [GitHub Issues](../../issues)
- [Pull Request Template](.github/pull_request_template.md)

## 📄 License

This project is [UNLICENSED](LICENSE).

---

**Happy coding! 🚀**

Built with ❤️ using NestJS, TypeScript, and modern development practices.