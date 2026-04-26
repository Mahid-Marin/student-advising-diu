# Render Deployment Guide

This document provides step-by-step instructions for deploying the Academic Atelier application to Render.

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Deployment Steps](#deployment-steps)
3. [Environment Variables](#environment-variables)
4. [Service URLs](#service-urls)
5. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- GitHub account with repository access
- Render account (https://render.com)
- Groq API key (https://console.groq.com/keys)

---

## Deployment Steps

### Step 1: Connect GitHub to Render

1. Go to [render.com](https://render.com)
2. Click **"New +"** and select **"Web Service"**
3. Select **"Connect a repository"**
4. Choose your GitHub repository: `student-advising-diu`
5. Authorize Render to access your GitHub account

### Step 2: Deploy Backend (Spring Boot)

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

### Step 3: Deploy Frontend (React + Vite)

1. **Create Static Site**
   - Name: `academic-atelier-frontend`
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/dist`

2. **Add Environment Variable**
   - `VITE_API_URL`: `https://academic-atelier-backend.onrender.com/api`

3. **Deploy**
   - Click **"Create Static Site"**
   - Wait for deployment (2-3 minutes)

### Step 4: Deploy Python API (Optional)

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

## Next Steps

- Set up custom domain (optional)
- Configure SSL/TLS certificate (automatic on Render)
- Set up scheduled backups for database
- Monitor service health and performance
