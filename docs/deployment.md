# Deployment Guide

This guide describes how to deploy the AI Resume Analyzer services to production environments.

## Deployment Stack
- **Frontend (Website)**: Netlify or Vercel
- **Backend (API Gateway)**: Render or Railway
- **AI Service (FastAPI)**: Render or Railway
- **Database**: MongoDB Atlas

---

## 1. Database Setup (MongoDB Atlas)
1. Sign up for a free tier database at [mongodb.com](https://www.mongodb.com/).
2. Create a new cluster and obtain your connection URI (e.g. `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai-resume`).
3. Under Network Access, whitelist `0.0.0.0/28` or your backend server IP to allow connections.

---

## 2. Deploy AI Microservice (FastAPI)
Deploy the `ai-service/` directory to **Render** or **Railway**:
- **Environment**: Python
- **Build Command**: `pip install -r requirements.txt`
- **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- **Environment Variables**:
  - `GEMINI_API_KEY`: Your Google Gemini API Key.
  - `PORT`: (Injected automatically by host, defaults to 8000).

Once deployed, copy the service URL (e.g. `https://ai-service-xxx.render.com`).

---

## 3. Deploy Backend Gateway (Express Node.js)
Deploy the `backend/` directory to **Render** or **Railway**:
- **Environment**: Node.js
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**:
  - `MONGODB_URI`: Your MongoDB connection URI.
  - `JWT_SECRET`: A long secure secret key string.
  - `AI_SERVICE_URL`: The URL of your FastAPI service (deployed in Step 2).
  - `NODE_ENV`: Set to `production`.

Once deployed, copy the backend service URL (e.g. `https://backend-gateway-xxx.render.com`).

---

## 4. Deploy Frontend Client (React)
Deploy the `website/` directory to **Netlify** or **Vercel**:
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: The URL of your backend gateway service (deployed in Step 3).

### Netlify Direct Deploy File (netlify.toml)
A preconfigured `netlify.toml` file is located at `website/netlify.toml` to automatically manage the build process and handle SPA routing.
