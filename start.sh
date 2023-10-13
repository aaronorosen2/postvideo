export COMPOSE_HTTP_TIMEOUT=2000
#!/bin/bash
docker-compose -f docker-compose.yml down
docker-compose -f docker-compose.yml build
docker-compose -f docker-compose.yml up -d

