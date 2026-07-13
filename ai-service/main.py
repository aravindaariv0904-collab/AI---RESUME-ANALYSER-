import io
import re
import os
import json
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn
from pydantic import BaseModel, Field
from typing import List

# Setup Gemini API optionally
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
has_gemini = False
if GEMINI_API_KEY:
    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        has_gemini = True
        print("✅ Gemini API is configured for Resume Analyzer")
    except Exception as e:
        print(f"⚠️ Failed to import/configure google-generativeai: {e}")

app = FastAPI(title="AI Resume Analyzer NLP Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# A more extensive mock database of skills mapped by roles
ROLE_REQUIREMENTS = {
    "software engineer": "python javascript react node.js mongodb sql java c++ docker aws git agile problem solving communication data structures algorithms",
    "data scientist": "python sql r machine learning deep learning tensorflow keras pytorch nlp pandas numpy statistics data visualization tableau communication",
    "web developer": "html css javascript react vue angular node.js mongodb postgresql ui ux responsive design tailwind bootstrap git problem solving",
    "product manager": "product strategy agile scrum roadmap prioritization user research data analysis jira communication leadership stakeholder management a/b testing",
}

# General skill database for extraction
ALL_SKILLS = set(skill for req in ROLE_REQUIREMENTS.values() for skill in req.split())
ALL_SKILLS.update(["c#", "go", "ruby", "php", "typescript", "kubernetes", "azure", "gcp", "linux", "jenkins", "ci/cd", "rest api", "graphql", "redis", "elasticsearch", "kafka", "rabbitmq"])

class ResumeAnalysisSchema(BaseModel):
    score: int = Field(description="ATS match score from 0 to 100 based on target role requirements")
    skills: List[str] = Field(description="List of detected technical skills and tools")
    missingSkills: List[str] = Field(description="Key skills required for the role that are missing or weak in the resume")
    skillsToLearn: List[str] = Field(description="Top 5 priority skills the candidate should focus on learning next")
    projectSuggestions: List[str] = Field(description="Actionable project suggestions to fill the missing skill gaps")
    hackathonsAndInternships: List[str] = Field(description="Suggested hackathons, internships, or next steps to boost career alignment")
    strengths: List[str] = Field(description="List of strengths identified in the resume (e.g. alignment, experience)")
    weaknesses: List[str] = Field(description="List of gaps or formatting issues found in the resume")
    summary: str = Field(description="A concise summary of the resume evaluation and suggestions")
    experienceEvaluation: str = Field(description="Detailed critique of the work history, verbs used, and quantified achievements")

def extract_text_from_pdf(file_bytes):
    try:
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
        text = " ".join(page.extract_text() for page in pdf_reader.pages if page.extract_text())
        return text
    except Exception as e:
        print(f"PDF extraction error: {e}")
        return ""

@app.post("/analyze")
async def analyze(file: UploadFile = File(...), target_role: str = Form(...)):
    content = await file.read()
    
    # Simple check for PDF/DOCX
    filename = file.filename.lower()
    if filename.endswith(".pdf"):
        raw_text = extract_text_from_pdf(content)
    else:
        # Fallback to decode if text
        try:
            raw_text = content.decode('utf-8', errors='ignore')
        except Exception:
            raw_text = ""
            
    raw_text_lower = raw_text.lower()
    # Remove basic punctuation to help matching
    clean_text = re.sub(r'[^\w\s]', ' ', raw_text_lower)
    
    # 1. Extract Skills (Used for TF-IDF and fallback)
    detected_skills = []
    for skill in ALL_SKILLS:
        if re.search(rf'\b{re.escape(skill)}\b', clean_text):
            detected_skills.append(skill.title())

    # Try Gemini analysis if configured
    if has_gemini and raw_text.strip():
        try:
            model = genai.GenerativeModel("gemini-2.5-flash")
            prompt = f"""
            Analyze the following resume for the target role of '{target_role}'.
            Extract the candidate's skills, find missing skills required for this role, and provide actionable feedback, recommendations, strengths, weaknesses, a summary, and an experience evaluation.
            
            Resume content:
            {raw_text[:12000]}
            """
            
            response = model.generate_content(
                prompt,
                generation_config=genai.GenerationConfig(
                    response_mime_type="application/json",
                    response_schema=ResumeAnalysisSchema,
                    temperature=0.1
                )
            )
            
            result = json.loads(response.text)
            print("✅ Successfully analyzed resume via Gemini API")
            return result
        except Exception as gem_err:
            print(f"⚠️ Gemini analysis error, falling back to local NLP: {gem_err}")

    # 2. Local Fallback (TF-IDF & Cosine Similarity)
    target_role_lower = target_role.lower()
    role_req_text = ROLE_REQUIREMENTS.get(target_role_lower, ROLE_REQUIREMENTS["software engineer"])
    
    try:
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([clean_text, role_req_text])
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    except ValueError:
        similarity_score = 0.0
        
    ats_score = min(int((similarity_score * 60) + 40 + (len(detected_skills) * 2)), 100)
    if len(detected_skills) == 0:
        ats_score = 15
        
    required_skills = set(role_req_text.split())
    detected_skills_lower = set(s.lower() for s in detected_skills)
    missing_skills = [s.title() for s in required_skills if s not in detected_skills_lower]
    
    projects = []
    if "React" in missing_skills or "Node.Js" in missing_skills:
        projects.append("Build a full-stack e-commerce app to learn React and Node.js.")
    if "Python" in missing_skills or "Machine Learning" in missing_skills:
        projects.append("Create a machine learning model to predict housing prices using Python.")
    if "Sql" in missing_skills:
        projects.append("Design a relational database for a hospital management system.")
        
    if not projects:
        projects.append(f"Contribute to an open-source project related to {target_role}.")
        
    hackathons = [
        "Participate in the upcoming global AI Hackathon.",
        "Look for local MLH (Major League Hacking) events.",
        "Apply for internships on LinkedIn and Internshala."
    ]
    
    strengths = []
    if ats_score > 70:
        strengths.append("Strong alignment with the target role.")
    if len(detected_skills) > 5:
        strengths.append("Good variety of technical skills.")
        
    weaknesses = []
    if len(missing_skills) > 3:
        weaknesses.append("Missing several key skills for this role.")
    if len(raw_text) < 500:
        weaknesses.append("Resume seems a bit short. Consider adding more detail to your experiences.")
        
    return {
        "score": ats_score,
        "skills": detected_skills,
        "missingSkills": missing_skills,
        "skillsToLearn": missing_skills[:5],
        "projectSuggestions": projects,
        "hackathonsAndInternships": hackathons,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "summary": f"Your resume scored {ats_score}/100 for the {target_role} role. Focus on learning {', '.join(missing_skills[:3])} to improve your chances. [Local NLP Fallback]",
        "experienceEvaluation": "We detected some experience. Make sure to use strong action verbs and quantify achievements. [Local NLP Fallback]"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
