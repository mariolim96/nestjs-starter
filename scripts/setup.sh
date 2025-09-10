#!/bin/bash
# filepath: scripts/setup.sh

echo "🚀 Setting up NestJS Chat Application infrastructure..."

# Create necessary directories
mkdir -p docker/postgres
mkdir -p docker/pgadmin
mkdir -p logs

# Start all services
echo "📦 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Check service health
echo "🔍 Checking service health..."
echo "PostgreSQL: $(docker-compose exec -T postgres pg_isready -U nestjs_user)"
echo "Redis: $(docker-compose exec -T redis redis-cli --no-auth-warning -a redis_password ping)"
echo "Kafka: $(docker-compose exec -T kafka kafka-topics --bootstrap-server localhost:9092 --list)"
echo "Elasticsearch: $(curl -s http://localhost:9200/_cluster/health | grep -o '"status":"[^"]*"')"

echo "✅ Setup complete!"
echo ""
echo "📊 Service URLs:"
echo "- PostgreSQL: localhost:5432"
echo "- pgAdmin: http://localhost:5050 (admin@example.com / admin)"
echo "- Redis: localhost:6379"
echo "- Kafka: localhost:9092"
echo "- Elasticsearch: localhost:9200"
echo "- Kibana: http://localhost:5601"
echo "- Kafka UI: http://localhost:8080"
echo "- Redis Commander: http://localhost:8081"
echo ""
echo "🔗 To connect your NestJS app, use the environment variables in .env"
echo ""
echo "📝 pgAdmin Setup:"
echo "1. Go to http://localhost:5050"
echo "2. Login with admin@example.com / admin"
echo "3. The PostgreSQL server should be auto-configured"
echo "4. If not, add server manually:"
echo "   - Host: postgres"
echo "   - Port: 5432"
echo "   - Database: nestjs_chat"
echo "   - Username: nestjs_user"
echo "   - Password: nestjs_password"