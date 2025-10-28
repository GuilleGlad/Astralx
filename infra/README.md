# Astralx Infrastructure

This directory contains all infrastructure-related files for the Astralx project.

## Contents

- `docker-compose.yml`: Complete development environment with MySQL, Redis, MinIO, and API
- `Dockerfile.api`: Docker image for the NestJS API
- `init-db.sql`: Initial database schema and sample data
- `setup-dev.sh`: Automated development environment setup script

## Quick Start

### Prerequisites

- Node.js 20+
- npm 10+
- Docker & Docker Compose
- Git

### Setup Development Environment

Run the automated setup script:

```bash
cd infra
./setup-dev.sh
```

This script will:

1. Install npm dependencies
2. Setup git hooks (husky)
3. Create `.env` file with defaults
4. Start all Docker services

### Manual Setup

If you prefer manual setup:

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start Docker services
docker-compose up -d

# Verify services are running
docker-compose ps

# Start API
npm run start:api

# Start Mobile (in another terminal)
npm run start:mobile
```

## Services

### MySQL (Port 3306)

- **User**: astralx
- **Password**: astralx123
- **Database**: astralx_dev
- **Root Password**: rootpassword

### Redis (Port 6379)

- Ready for caching and job queues

### MinIO (Ports 9000, 9001)

- **Access Key**: minioadmin
- **Secret Key**: minioadmin123
- **Console**: http://localhost:9001
- **Bucket**: astralx-media

### API (Port 3000)

- **REST API**: http://localhost:3000/api
- **OpenAPI Docs**: http://localhost:3000/api/docs
- **Health Check**: http://localhost:3000/api/health

## Useful Commands

```bash
# View logs
docker-compose logs -f

# Stop all services
docker-compose down

# Stop and remove volumes (clean slate)
docker-compose down -v

# Rebuild services
docker-compose up -d --build

# Access MySQL
docker exec -it astralx-mysql mysql -u astralx -pastralx123 astralx_dev

# Access Redis CLI
docker exec -it astralx-redis redis-cli
```

## Development Workflow

1. Make code changes in `apps/api` or `apps/mobile`
2. The API has hot-reload enabled via webpack
3. The mobile app uses Metro bundler for fast refresh
4. Run tests: `npm test`
5. Run linter: `npm run lint`

## Troubleshooting

### Services not starting

```bash
# Check Docker status
docker-compose ps

# Check logs
docker-compose logs [service-name]

# Restart specific service
docker-compose restart [service-name]
```

### Port conflicts

If ports are already in use, modify the port mappings in `docker-compose.yml`

### Database connection issues

Ensure MySQL is healthy:

```bash
docker-compose ps mysql
# Should show "healthy" status
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/ci-cd.yml`) runs:

- Linting
- Tests
- Builds
- Deployment to dev (on main branch)

## Next Steps

After infrastructure is set up, you can:

1. Generate OpenAPI TypeScript clients for mobile app
2. Create new NestJS modules: `nx g @nx/nest:resource <name>`
3. Add mobile screens: `nx g @nx/react-native:component <name>`
4. Configure additional services as needed
