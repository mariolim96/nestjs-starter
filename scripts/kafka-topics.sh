#!/bin/bash
# filepath: scripts/kafka-topics.sh

echo "📝 Creating Kafka topics for NestJS Chat Application..."

# List of topics needed for the application
topics=(
    "chat-messages"
    "translated-messages"
    "external-events"
    "kanban-events"
    "user-presence"
    "notifications"
)

for topic in "${topics[@]}"; do
    echo "Creating topic: $topic"
    docker-compose exec kafka kafka-topics \
        --create \
        --topic $topic \
        --bootstrap-server localhost:9092 \
        --partitions 3 \
        --replication-factor 1 \
        --if-not-exists
done

echo "✅ Kafka topics created successfully!"
echo "📋 List of topics:"
docker-compose exec kafka kafka-topics --bootstrap-server localhost:9092 --list