# Troubleshooting Guide

This guide covers common issues and resolutions when running the AI Resume Analyzer services locally or in production.

---

## 1. Local Database Issues

### Issue: Backend fails to connect to database
- **Symptom**: Console logs show `Mongoose connection error` or backend crashes on startup.
- **Cause**: By default, in-memory MongoDB server is used in development. If that fails to download or configure, the server cannot start.
- **Solution**:
  1. Ensure you have internet access on the first launch so that `mongodb-memory-server` can download the binary.
  2. Alternatively, set a real MongoDB connection string in your environment:
     ```bash
     export MONGODB_URI="mongodb://localhost:27017/ai-resume"
     export NODE_ENV="production" # forces using the MONGODB_URI instead of memory server
     ```

---

## 2. API Communication Failures

### Issue: "Failed to analyze resume" error on website
- **Symptom**: User uploads a file, clicks Analyze, and a red error card appears.
- **Cause**:
  - The Express backend (`http://localhost:5000`) cannot reach the FastAPI service (`http://localhost:8000`).
  - Or the React website cannot reach the Express backend.
- **Solution**:
  1. Check if both backend processes are running in active terminal tabs.
  2. Verify network connections by opening `http://localhost:8000/docs` in your browser.
  3. Ensure CORS middleware is enabled. By default, FastAPI and Express are preconfigured to allow all origins in development mode.

---

## 3. Gemini API Failure Fallback

### Issue: Gemini rate limits or API key errors
- **Symptom**: Logs show `Gemini analysis error, falling back to local NLP`.
- **Cause**: Invalid API key, rate limits hit, or network timeout reaching Google API servers.
- **Solution**:
  - The application automatically falls back to local TF-IDF processing. You do not need to restart anything; your score will still render, but some detailed analysis blocks will show fallback indicators.
  - Verify your API key has correct permissions and balance.
