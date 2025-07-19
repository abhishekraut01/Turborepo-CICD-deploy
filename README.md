# Docker Setup Guide

This monorepo contains Docker configurations for the following services:
- **Backend** (Express.js API on port 3001)
- **Frontend** (Next.js web application on port 3000)
- **WebSockets** (WebSocket server on port 9000)
- **Database** (PostgreSQL on port 5432)

## Prerequisites

- Docker and Docker Compose installed
- At least 4GB of available RAM
- 10GB of free disk space

## Quick Start

1. **Clone and navigate to the repository**:
   ```bash
   cd Deploy-monorepo
   ```

2. **Create environment file** (optional):
   ```bash
   cp .env.example .env
   # Edit .env file as needed
   ```

3. **Build and start all services**:
   ```bash
   docker-compose up --build
   ```

4. **Access the applications**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001
   - WebSocket: ws://localhost:9000
   - Database: localhost:5432

## Individual Service Commands

### Build individual services:
```bash
# Backend only
docker build -f docker/Dockerfile.backend -t backend:latest .

# Frontend only
docker build -f docker/Dockerfile.frontend -t frontend:latest .

# WebSockets only
docker build -f docker/Dockerfile.websockets -t websockets:latest .
```

### Run individual services:
```bash
# Backend
docker run -p 3001:3001 backend:latest

# Frontend
docker run -p 3000:3000 frontend:latest

# WebSockets
docker run -p 9000:9000 websockets:latest
```

## Docker Compose Commands

```bash
# Build all services
docker-compose build

# Start services (detached)
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Rebuild and restart specific service
docker-compose up --build backend

# Scale a service
docker-compose up --scale backend=3
```

## Development vs Production

### Development:
- Uses `--no-frozen-lockfile` for package installation
- Includes development dependencies
- Optimized for fast rebuilds

### Production:
- Uses optimized Node.js Alpine images
- Runs as non-root user
- Multi-stage builds for smaller images
- Health checks and proper signal handling

## Environment Variables

Create a `.env` file in the root directory:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@db:5432/monorepo_db

# Node Environment
NODE_ENV=production

# Optional: Custom ports
BACKEND_PORT=3001
FRONTEND_PORT=3000
WEBSOCKET_PORT=9000
```

## Troubleshooting

### Common Issues:

1. **Port conflicts**: Ensure ports 3000, 3001, 9000, and 5432 are available
2. **Memory issues**: Increase Docker's memory limit to at least 4GB
3. **Build failures**: Clean Docker cache with `docker system prune -a`
4. **Permission issues**: Ensure Docker has proper file system access

### Clean Start:
```bash
# Stop all containers
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Clean system
docker system prune -a

# Rebuild everything
docker-compose up --build
```

### Logs and Debugging:
```bash
# View logs for all services
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend

# Execute shell in running container
docker-compose exec backend sh
```

## Architecture Overview

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Frontend  │────│   Backend   │────│  WebSockets │
│  (Next.js)  │    │ (Express.js)│    │   (Node.js) │
│   Port 3000 │    │  Port 3001  │    │  Port 9000  │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       └───────────────────┼───────────────────┘
                           │
                  ┌─────────────┐
                  │ PostgreSQL  │
                  │  Port 5432  │
                  └─────────────┘
```

## File Structure

```
├── docker/
│   ├── Dockerfile.backend      # Backend service
│   ├── Dockerfile.frontend     # Frontend service
│   └── Dockerfile.websockets   # WebSocket service
├── docker-compose.yml          # Multi-service orchestration
├── .dockerignore               # Files to exclude from build
├── .env.example                # Environment variables template
└── README.docker.md            # This file
```

## Security Considerations

- All services run as non-root users
- Sensitive data managed through environment variables
- Network isolation through Docker networks
- Volume permissions properly configured
- No secrets embedded in images

## Performance Tips

- Use Docker BuildKit for faster builds
- Leverage multi-stage builds
- Cache dependencies effectively
- Use .dockerignore to exclude unnecessary files
- Consider using distroless images for production
