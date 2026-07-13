# API Reference

This document covers public and internal API endpoints for the AI Resume Analyzer services.

---

## 1. Authentication Routes (Backend Gateway)

### Register User
* **Endpoint**: `/api/auth/register`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Body**:
  ```json
  {
    "name": "Aravind Aariv",
    "email": "aravind@example.com",
    "password": "password123",
    "university": "Stanford",
    "graduationYear": 2026
  }
  ```
* **Response (200 Success)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": "649c2f6d...",
      "name": "Aravind Aariv",
      "email": "aravind@example.com"
    }
  }
  ```

### Login User
* **Endpoint**: `/api/auth/login`
* **Method**: `POST`
* **Content-Type**: `application/json`
* **Body**:
  ```json
  {
    "email": "aravind@example.com",
    "password": "password123"
  }
  ```
* **Response (200 Success)**:
  ```json
  {
    "token": "eyJhbGciOiJIUzI1NiIsInR5...",
    "user": {
      "id": "649c2f6d...",
      "name": "Aravind Aariv",
      "email": "aravind@example.com"
    }
  }
  ```

---

## 2. Resume & Analysis Routes (Backend Gateway)

### Analyze Resume (Authenticated)
* **Endpoint**: `/api/resume/analyze`
* **Method**: `POST`
* **Headers**: `x-auth-token: <jwt_token>`
* **Content-Type**: `multipart/form-data`
* **Form-Data Params**:
  * `resume`: [File] PDF resume upload
  * `targetRole`: "Software Engineer" | "Data Scientist" | "Web Developer" | "Product Manager"
* **Response (200 Success)**:
  ```json
  {
    "_id": "649c30f4...",
    "userId": "649c2f6d...",
    "targetRole": "Software Engineer",
    "originalFilename": "resume.pdf",
    "score": 85,
    "skills": ["Python", "React", "Node.js", "SQL", "Git"],
    "missingSkills": ["Docker", "Kubernetes", "AWS"],
    "skillsToLearn": ["Docker", "Kubernetes", "AWS"],
    "projectSuggestions": ["Build a full-stack e-commerce app to learn React and Node.js."],
    "hackathonsAndInternships": ["Participate in the upcoming global AI Hackathon."],
    "strengths": ["Strong alignment with the target role."],
    "weaknesses": ["Missing several key skills for this role."],
    "summary": "Your resume scored 85/100 for the Software Engineer role.",
    "experienceEvaluation": "We detected some experience, but make sure to use strong action verbs."
  }
  ```

### Get Analysis History (Authenticated)
* **Endpoint**: `/api/resume/history`
* **Method**: `GET`
* **Headers**: `x-auth-token: <jwt_token>`
* **Response (200 Success)**: Array of past Analysis objects.

---

## 3. NLP Microservice (FastAPI Internal API)

### Process Resume Raw Analysis
* **Endpoint**: `/analyze`
* **Method**: `POST`
* **Content-Type**: `multipart/form-data`
* **Form-Data Params**:
  * `file`: [File] PDF or text file
  * `target_role`: String target role
* **Response (200 Success)**: Structured JSON analysis object (conforming to `ResumeAnalysisSchema`).
