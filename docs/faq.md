# Frequently Asked Questions

### 1. Can I use this analyzer without a Google Gemini API Key?
Yes! The FastAPI AI microservice has a built-in TF-IDF fallback engine. If the `GEMINI_API_KEY` environment variable is not configured, the service will perform local keyword extraction and calculate a cosine similarity score. However, semantic evaluation, detailed resume critique, and strengths/weaknesses feedback will be simplified.

### 2. Is my resume data saved or stored?
Your parsed resume text and files are processed strictly in-memory by the FastAPI service and are never written to disk. The Express gateway saves the structured JSON metadata output (skills found, scores, recommendations) in your private account history inside MongoDB so that you can view your dashboard at any time.

### 3. Why am I getting a low ATS match score?
The score is calculated based on candidate skills overlapping with the core requirements of the target role. To improve your score:
- Customize your resume for the specific target role.
- Add clear mentions of technical skills (e.g. "React", "Python", "SQL") where applicable.
- Make sure to use standard PDF layouts that are easy to parse.

### 4. Which file formats are supported?
Currently, the system is optimized for **PDF** documents (`.pdf`). Support for Word files (`.docx`) is planned for a future release.
