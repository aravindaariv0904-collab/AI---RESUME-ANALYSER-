from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
import io
import uvicorn

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SKILL_DB = ["python", "javascript", "react", "node.js", "mongodb", "sql", "machine learning", "aws", "docker", "java", "css", "html"]

def extract_text_from_pdf(file_bytes):
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text()
        return text
    except Exception:
        return ""

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), target_role: str = Form(...)):
    content = await file.read()
    raw_text = extract_text_from_pdf(content)
    raw_text_lower = raw_text.lower()
    
    detected_skills = [skill.title() for skill in SKILL_DB if skill in raw_text_lower]
    missing_skills = [skill.title() for skill in SKILL_DB if skill not in raw_text_lower][:4]
    
    score = min(50 + (len(detected_skills) * 8), 98)
    if len(detected_skills) == 0:
        score = 30
        detected_skills = ["Communication", "Problem Solving"]
    
    return {
        "score": score,
        "skills": detected_skills,
        "missingSkills": missing_skills,
        "recommendations": [f"Learn {s} for better {target_role} compatibility" for s in missing_skills],
        "summary": f"Your resume has a strong foundation for a {target_role}. Keep adding technical projects!"
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
