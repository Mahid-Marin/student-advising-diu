# Docker Setup Guide for Academic Atelier

This guide provides step-by-step instructions for building and running the Academic Atelier application using Docker.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Building Individual Services](#building-individual-services)
4. [Running with Docker Compose](#running-with-docker-compose)
5. [Docker Configuration](#docker-configuration)
6. [Troubleshooting](#troubleshooting)
7. [Advanced Usage](#advanced-usage)

---

## Prerequisites

### Required
- Docker (version 20.10+)
- Docker Compose (version 2.0+)
- Git

### Optional
- Docker Desktop (includes Docker and Docker Compose)
- Visual Studio Code with Docker extension

### Installation

**Windows/Mac:**
```
Download Docker Desktop from: https://www.docker.com/products/docker-desktop
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

---

## Quick Start

### 1. Clone and Navigate to Project
```bash
cd academic-atelier
```

### 2. Set Environment Variables
```bash
# Create .env file from example
cp .env.example .env

# Edit .env and add your Groq API key
# GROQ_API_KEY=your_groq_api_key_here
```

### 3. Build All Services
```bash
docker-compose build
```

### 4. Start All Services
```bash
docker-compose up -d
```

### 5. Access Services
```
Frontend:  http://localhost:3000
Backend:   http://localhost:8080/api
Python API: http://localhost:8000
API Docs:  http://localhost:8000/docs
```

### 6. Stop Services
```bash
docker-compose down
```

---

## Building Individual Services

### Backend (Spring Boot)

**Build:**
```bash
docker build -f backend-spring/Dockerfile -t academic-atelier-backend:latest .
```

**Run:**
```bash
docker run -p 8080:8080 \
  -e GROQ_API_KEY=your_key_here \
  academic-atelier-backend:latest
```

### Frontend (React + Vite)

**Build:**
```bash
docker build -f frontend/Dockerfile -t academic-atelier-frontend:latest .
```

**Run:**
```bash
docker run -p 3000:3000 \
  -e VITE_API_URL=http://localhost:8080/api \
  academic-atelier-frontend:latest
```

### Python API (FastAPI)

**Build:**
```bash
docker build -f python-api/Dockerfile -t academic-atelier-python-api:latest .
```

**Run:**
```bash
docker run -p 8000:8000 \
  -e GROQ_API_KEY=your_key_here \
  academic-atelier-python-api:latest
```

---

## Running with Docker Compose

### Start Services (Foreground)
```bash
docker-compose up
```

### Start Services (Background)
```bash
docker-compose up -d
```

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f python-api
```

### Stop Services
```bash
docker-compose down
```

### Remove Volumes
```bash
# Remove data volumes
docker-compose down -v
```

### Rebuild Services
```bash
# Rebuild all
docker-compose build --no-cache

# Rebuild specific service
docker-compose build --no-cache backend
```

---

## Docker Configuration

### docker-compose.yml Overview

```yaml
services:
  backend:      # Spring Boot API on port 8080
  frontend:     # React app on port 3000
  python-api:   # FastAPI on port 8000
```

### Environment Variables

**Backend (.env):**
```
GROQ_API_KEY=your_groq_api_key_here
JAVA_OPTS=-Xmx512m
```

**Frontend (.env):**
```
VITE_API_URL=http://localhost:8080/api
```

**Python API (.env):**
```
GROQ_API_KEY=your_groq_api_key_here
```

### Dockerfile Strategies

**Backend:** Multi-stage build
- Reduces final image size by ~90%
- Stage 1: Maven build environment
- Stage 2: Lightweight Java runtime

**Frontend:** Multi-stage build
- Separates build tools from runtime
- Uses Node.js slim image with serve

**Python API:** Single-stage build
- Uses Python 3.11 slim image
- Minimal dependencies

---

## Troubleshooting

### Issue: Port Already in Use

**Problem:** `Error: bind: address already in use`

**Solution:**
```bash
# Check what's using the port
sudo lsof -i :8080

# Use different port in docker-compose.yml
# Change "8080:8080" to "8081:8080"
```

### Issue: Container Won't Start

**Check logs:**
```bash
docker-compose logs backend
```

**Common causes:**
- Out of memory: Increase Docker memory limit
- Missing environment variable: Set GROQ_API_KEY
- Port conflict: Use different port mapping

### Issue: Frontend Can't Reach Backend

**Check CORS:**
```bash
# Verify backend CORS settings
docker-compose exec backend curl http://backend:8080/api/health
```

**Solution:**
- Update `VITE_API_URL` environment variable
- Ensure backend CORS allows frontend origin

### Issue: Out of Memory

**Increase Docker resources:**

**Windows/Mac:**
1. Open Docker Desktop
2. Settings → Resources
3. Increase Memory (suggest 4GB+)

**Linux:**
```bash
# Check current usage
docker stats

# Limit service memory in docker-compose.yml
deploy:
  resources:
    limits:
      memory: 1G
```

### Issue: Permission Denied

**Problem:** `permission denied while trying to connect to Docker daemon`

**Solution (Linux):**
```bash
sudo usermod -aG docker $USER
newgrp docker
```

---

## Advanced Usage

### Building for Production

```bash
# Build with optimization flags
docker build \
  --build-arg JAVA_OPTS="-Xmx1024m" \
  -f backend-spring/Dockerfile \
  -t academic-atelier-backend:prod \
  .
```

### Multi-Platform Builds

```bash
# Build for multiple architectures
docker buildx build --platform linux/amd64,linux/arm64 \
  -f backend-spring/Dockerfile \
  -t academic-atelier-backend:latest \
  .
```

### Custom Network

```bash
# Create custom network
docker network create app-network

# Run services on custom network
docker run --network app-network --name backend academic-atelier-backend:latest
docker run --network app-network --name frontend academic-atelier-frontend:latest
```

### Health Checks

All containers include health checks:
```bash
# Check service health
docker inspect --format='{{.State.Health.Status}}' container_name
```

### Debugging

```bash
# Interactive shell
docker exec -it backend /bin/bash

# View image layers
docker history academic-atelier-backend:latest

# Inspect image
docker inspect academic-atelier-backend:latest
```

### Cleaning Up

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove all Docker artifacts
docker system prune -a
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
name: Build Docker Images

on: [push]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: docker/setup-buildx-action@v2
      - uses: docker/build-push-action@v4
        with:
          context: .
          file: backend-spring/Dockerfile
          push: false
          tags: academic-atelier-backend:latest
```

---

## Deploying to Render with Docker

### Option 1: Using Docker Image

1. Push Docker image to Docker Hub:
```bash
docker tag academic-atelier-backend:latest username/academic-atelier-backend:latest
docker push username/academic-atelier-backend:latest
```

2. On Render:
- Create Web Service
- Select "Docker" runtime
- Set Image URL: `username/academic-atelier-backend:latest`

### Option 2: Using Dockerfile

1. In Render dashboard:
- Create Web Service
- Connect GitHub repo
- Select "Docker" runtime
- Render will auto-detect Dockerfile

---

## Performance Optimization

### Image Size Reduction

```bash
# Check image sizes
docker images

# Use .dockerignore to exclude unnecessary files
# Already configured - check .dockerignore file
```

### Layer Caching

- Dockerfile instructions ordered for optimal caching
- Dependencies cached separately from source code
- Copy package files before source code

### Build Speed

```bash
# Use BuildKit for faster builds
DOCKER_BUILDKIT=1 docker build -f backend-spring/Dockerfile .

# In docker-compose.yml
DOCKER_BUILDKIT: 1
```

---

## Security Best Practices

✅ **Already Implemented:**
- Non-root user (UID 1000)
- Minimal base images
- Multi-stage builds
- Health checks
- No sensitive data in images
- Alpine/slim images for small attack surface

✅ **Additional Steps:**
```bash
# Scan for vulnerabilities
docker scan academic-atelier-backend:latest

# Sign images
docker trust signer add --key ~/.docker/notary/root_keys/root_key username
```

---

## Next Steps

1. **Test locally:** `docker-compose up`
2. **Deploy to Render:** Push image to Docker Hub, then deploy
3. **Set up CI/CD:** Automate builds with GitHub Actions
4. **Monitor:** Use Docker logging and health checks
5. **Scale:** Use container orchestration (Kubernetes)
