In DBeaver CloudBeaver, try these connection settings:
Option 1 (using container name):

Host: nestjs-postgres
Port: 5432
Database: Your ${DATABASE_NAME}
Username: Your ${DATABASE_USER}
Password: Your ${DATABASE_PASSWORD}


docker network inspect nest-start_nestjs-network

to enter into redis db
docker exec -it nestjs-redis redis-cli -a redis_password
to see all keys
docker exec nestjs-redis redis-cli -a redis_password KEYS "*"