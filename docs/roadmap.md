# Project Roadmap

This document maps out the feature and engineering roadmap for the AI Resume Analyzer.

## Phase 1: Core Functionality (Completed)
- [x] Basic multi-service setup (FastAPI + Express + React).
- [x] Simple TF-IDF cosine-similarity keyword extractor.
- [x] User registration & authentication with JSON Web Tokens.
- [x] Analysis history storage in MongoDB.
- [x] Basic PDF file upload and parsing.

## Phase 2: AI Enhancements (Completed)
- [x] Optional Google Gemini API integration for deep semantic profiling.
- [x] Pydantic structured output validation for AI responses.
- [x] Graceful fallback to local TF-IDF model during API timeouts.
- [x] Modern glassmorphic theme styling & micro-animations.
- [x] Unified test coverage with Pytest and Jest.

## Phase 3: Advanced Parsing & Integration (Q3 2026)
- [ ] Add direct DOCX parsing support without client-side conversion.
- [ ] Parse nested complex table structures in PDFs using advanced OCR libraries (e.g. `pdfplumber` or `easyocr`).
- [ ] Integrate with external recruitment platforms (e.g. LinkedIn, Indeed APIs) to fetch live target job specifications automatically.

## Phase 4: Enterprise Scale (Q4 2026)
- [ ] Deploy services via Docker containers orchestration (Kubernetes).
- [ ] Implement Redis caching layer to store analyzed resume hashes and save LLM token costs.
- [ ] Add multi-lingual resume matching for international markets.
