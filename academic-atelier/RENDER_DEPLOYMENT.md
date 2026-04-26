# Render Deployment Guide

This document provides step-by-step instructions for deploying the Academic Atelier application to Render.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start with Docker](#quick-start-with-docker)
3. [Deployment Steps](#deployment-steps)
4. [Environment Variables](#environment-variables)
5. [Service URLs](#service-urls)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account with repository access
- Render account (https://render.com)
- Groq API key (https://console.groq.com/keys)

---

## Quick Start with Docker (Recommended)

Docker simplifies deployment by bundling all dependencies together. This is the **recommended approach** for Render.

### Option A: Deploy Using Docker Compose (Locally First)

1. **Install Docker Desktop** from https://www.docker.com/products/docker-desktop

2. **Clone and setup**
   ```bash
   git clone https://github.com/Mahid-Marin/student-advising-diu.git
   cd academic-atelier
   cp .env.example .env
   # Edit .env and add GROQ_API_KEY
   ```

3. **Build and run locally**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. **Test locally**
   ```
   Frontend: http://localhost:3000
   Backend: http://localhost:8080/api
   Python API: http://localhost:8000
   ```

5. **Verify all services are running**
   ```bash
   docker-compose ps
   ```

### Option B: Deploy Docker Image to Render

#### Step 1: Push Docker Image to Docker Hub

1. Create Docker Hub account at https://hub.docker.com

2. Push individual services:
   ```bash
   # Login to Docker Hub
   docker login
   
   # Build and tag backend
   docker build -f backend-spring/Dockerfile -t your-username/academic-atelier-backend:latest .
   docker push your-username/academic-atelier-backend:latest
   
   # Build and tag frontend
   docker build -f frontend/Dockerfile -t your-username/academic-atelier-frontend:latest .
   docker push your-username/academic-atelier-frontend:latest
   
   # Build and tag python-api (optional)
   docker build -f python-api/Dockerfile -t your-username/academic-atelier-python-api:latest .
   docker push your-username/academic-atelier-python-api:latest
   ```

#### Step 2: Deploy on Render

**Backend Service:**
1. Go to Render Dashboard → **"New +"** → **"Web Service"**
2. Choose **"Deploy an existing image"**
3. **Image URL**: `your-username/academic-atelier-backend:latest`
4. **Name**: `academic-atelier-backend`
5. **Port**: `8080`
6. **Add Environment Variables**:
   - `GROQ_API_KEY`: Your API key
   - `JAVA_OPTS`: `-Xmx512m`
7. **Deploy**

**Frontend Service:**
1. **"New +"** → **"Web Service"**
2. Choose **"Deploy an existing image"**
3. **Image URL**: `your-username/academic-atelier-frontend:latest`
4. **Name**: `academic-atelier-frontend`
5. **Port**: `3000`
6. **Add Environment Variable**:
   - `VITE_API_URL`: `https://academic-atelier-backend.onrender.com/api`
7. **Deploy**

**Python API (Optional):**
1. **"New +"** → **"Web Service"**
2. Choose **"Deploy an existing image"**
3. **Image URL**: `your-username/academic-atelier-python-api:latest`
4. **Name**: `academic-atelier-python-api`
5. **Port**: `8000`
6. **Add Environment Variable**:
   - `GROQ_API_KEY`: Your API key
7. **Deploy**

---

### Option C: Direct Deployment from GitHub (Docker Auto-Detection)

If Render finds a Dockerfile in your repository, it will automatically use Docker:

1. **"New +"** → **"Web Service"**
2. **Connect GitHub repository** → `student-advising-diu`
3. Render will auto-detect `Dockerfile` in each service folder
4. **Runtime**: Docker (auto-selected)
5. Configure environment variables
6. **Deploy**

---

## Deployment Steps

### Traditional Deployment (Without Docker)

**Note:** Using Docker (see above) is recommended for easier deployment and consistency.

#### Step 1: Connect GitHub to Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** and select **"Web Service"**
3. Select **"Connect a repository"**
4. Choose your GitHub repository: `student-advising-diu`
5. Authorize Render to access your GitHub account

#### Step 2: Deploy Backend (Spring Boot)

1. **Create Web Service**
   - Name: `academic-atelier-backend`
   - Runtime: `Java`
   - Build Command: `cd backend-spring && mvn clean package -DskipTests`
   - Start Command: `cd backend-spring && java -Dserver.port=$PORT -jar target/academic-atelier-backend-1.0.0.jar`

2. **Add Environment Variables**
   - `GROQ_API_KEY`: Your Groq API key
   - `JAVA_OPTS`: `-Xmx512m`

3. **Deploy**
   - Click **"Create Web Service"**
   - Wait for build and deployment (5-10 minutes)

#### Step 3: Deploy Frontend (React + Vite)

1. **Create Static Site**
   - Name: `academic-atelier-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

2. **Add Environment Variable**
   - `VITE_API_URL`: `https://academic-atelier-backend.onrender.com/api`

3. **Deploy**
   - Click **"Create Static Site"**
   - Wait for deployment (2-3 minutes)

#### Step 4: Deploy Python API (Optional)

1. **Create Web Service**
   - Name: `academic-atelier-python-api`
   - Runtime: `Python 3.11`
   - Build Command: `cd python-api && pip install -r requirements.txt`
   - Start Command: `cd python-api && uvicorn main:app --host 0.0.0.0 --port $PORT`

2. **Add Environment Variable**
   - `GROQ_API_KEY`: Your Groq API key

3. **Deploy**
   - Click **"Create Web Service"**
   - Wait for deployment

---

## Environment Variables

### Backend Environment Variables

```
GROQ_API_KEY=your_groq_api_key_here
PORT=8080
JAVA_OPTS=-Xmx512m
SPRING_DATASOURCE_URL=jdbc:h2:mem:testdb
SPRING_JPA_DATABASE_PLATFORM=org.hibernate.dialect.H2Dialect
```

### Frontend Environment Variables

```
VITE_API_URL=https://academic-atelier-backend.onrender.com/api
```

### Python API Environment Variables

```
GROQ_API_KEY=your_groq_api_key_here
PORT=8000
```

---

## Service URLs

After successful deployment, your services will be available at:

| Service | URL |
|---------|-----|
| Backend API | `https://academic-atelier-backend.onrender.com/api` |
| Frontend | `https://academic-atelier-frontend.onrender.com` |
| Python API | `https://academic-atelier-python-api.onrender.com` |

### Health Check Endpoints

```
# Backend Health
https://academic-atelier-backend.onrender.com/api/health

# Frontend
https://academic-atelier-frontend.onrender.com

# Python API
https://academic-atelier-python-api.onrender.com/docs
```

---

## Troubleshooting

### Backend Build Fails

**Issue**: `Maven build fails with Java version error`

**Solution**:
- Ensure `pom.xml` has `<java.version>25</java.version>` or compatible version
- Check `JAVA_OPTS` environment variable

### Frontend Build Fails

**Issue**: `npm install fails`

**Solution**:
- Delete `node_modules` locally
- Push fresh `package-lock.json` to GitHub
- Trigger rebuild on Render

### CORS Errors

**Issue**: Frontend cannot reach backend API

**Solution**:
- Update backend CORS configuration with frontend URL
- Add `https://academic-atelier-frontend.onrender.com` to allowed origins

### Services Won't Start

**Issue**: Services spinning down or restarting

**Solution**:
- Free tier services spin down after 15 minutes of inactivity
- Upgrade to paid plan for persistent services
- Add health checks to prevent automatic restarts

### API Key Issues

**Issue**: `GROQ_API_KEY` not working

**Solution**:
- Verify API key is correct from https://console.groq.com/keys
- Ensure environment variable is set correctly in Render dashboard
- Restart service after updating environment variable

---

## Auto-Deployment Setup

To enable automatic deployment when you push to GitHub:

1. In Render dashboard, go to service settings
2. Under **"Deploy Hook"**, copy the webhook URL
3. Go to GitHub repository → Settings → Webhooks
4. Add new webhook with Render's URL
5. Select events: **"Push events"**
6. Now every push to `main` branch will trigger automatic deployment

---

## Database Migration

Currently using H2 in-memory database (data resets on restart).

For production, set up PostgreSQL on Render:

1. Create new PostgreSQL database on Render
2. Get connection string
3. Add environment variable: `DATABASE_URL=postgresql://...`
4. Update backend to use PostgreSQL

---

## Monitoring & Logs

### View Logs

1. Go to service in Render dashboard
2. Click **"Logs"** tab
3. Monitor real-time logs

### Performance

- Monitor CPU and memory usage
- Check for errors in logs
- Optimize if approaching resource limits

---

## Docker vs Traditional Deployment

### Docker Deployment (Recommended)
✅ **Advantages:**
- Consistent environment across development, testing, and production
- Faster deployment and rollback
- Better resource utilization
- Easier scaling
- Industry standard for modern deployments
- One-time setup, then auto-deploys on GitHub push

### Traditional Deployment
✅ **Advantages:**
- Simpler for first-time deployments
- No Docker knowledge required
- Good for monolithic applications

---

## Monitoring & Debugging

### Docker Deployment

**View Logs:**
```bash
# On Render dashboard
1. Go to service → "Logs" tab
2. View real-time container logs
3. Check for errors and performance issues
```

**Health Checks:**
All Docker containers include built-in health checks:
- Backend: `/api/health`
- Frontend: `/`
- Python API: `/docs`

### Resource Usage

**Monitor in Render Dashboard:**
1. Go to service → "Metrics"
2. View CPU and memory usage
3. Identify performance bottlenecks

---

## Using Docker Locally Before Deployment

Before deploying to Render, test Docker locally:

### 1. Build Images Locally
```bash
docker build -f backend-spring/Dockerfile -t academic-atelier-backend:test .
docker build -f frontend/Dockerfile -t academic-atelier-frontend:test .
docker build -f python-api/Dockerfile -t academic-atelier-python-api:test .
```

### 2. Run with Docker Compose
```bash
docker-compose up -d
```

### 3. Test Services
```bash
curl http://localhost:8080/api/health
curl http://localhost:3000
curl http://localhost:8000/docs
```

### 4. Check Logs
```bash
docker-compose logs -f backend
```

### 5. Stop Services
```bash
docker-compose down
```

---

## Deployment Comparison

| Feature | Docker | Traditional |
|---------|--------|-------------|
| Setup Time | 5-10 minutes | 5-10 minutes |
| Consistency | ✅ Perfect | ⚠️ May vary |
| Scaling | ✅ Easy | ⚠️ Complex |
| Local Testing | ✅ Full replica | ⚠️ Partial |
| Learning Curve | 📚 Moderate | 📚 Low |
| Production Ready | ✅ Yes | ✅ Yes |

---

## Docker Resources

For more information about Docker and deployment:

- **Docker Guide**: See `DOCKER_GUIDE.md` in project root
- **Docker Documentation**: https://docs.docker.com
- **Render Docker Docs**: https://render.com/docs/deploy-docker-image
- **Best Practices**: https://docs.docker.com/develop/dev-best-practices/

---

## Next Steps

1. **Choose deployment method**: Docker (recommended) or Traditional
2. **Test locally**: Use Docker Compose or local development servers
3. **Set up environment variables**: Add Groq API key
4. **Deploy to Render**: Follow steps for your chosen method
5. **Monitor deployment**: Check logs and health status
6. **Enable auto-deployment**: Push to GitHub for automatic updates

---
