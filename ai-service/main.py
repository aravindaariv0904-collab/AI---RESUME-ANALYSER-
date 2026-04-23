import io
import re
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
import PyPDF2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import uvicorn
import pydantic

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
        # For simplicity in this demo, just fallback to dummy text or decode if text
        try:
            raw_text = content.decode('utf-8', errors='ignore')
        except:
            raw_text = ""
            
    raw_text_lower = raw_text.lower()
    # Remove basic punctuation to help matching
    clean_text = re.sub(r'[^\w\s]', ' ', raw_text_lower)
    
    # 1. Extract Skills
    detected_skills = []
    for skill in ALL_SKILLS:
        # Simple word boundary regex match
        if re.search(rf'\b{re.escape(skill)}\b', clean_text):
            detected_skills.append(skill.title())
            
    # 2. Role Matching (TF-IDF & Cosine Similarity)
    target_role_lower = target_role.lower()
    role_req_text = ROLE_REQUIREMENTS.get(target_role_lower, ROLE_REQUIREMENTS["software engineer"])
    
    # Calculate similarity between extracted text and role requirements
    try:
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform([clean_text, role_req_text])
        similarity_score = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
    except ValueError:
        similarity_score = 0.0
        
    # Scale similarity to an ATS score (0-100)
    # Add a base score because real resumes have formatting, education, etc.
    ats_score = min(int((similarity_score * 60) + 40 + (len(detected_skills) * 2)), 100)
    if len(detected_skills) == 0:
        ats_score = 15
        
    # 3. Missing Skills
    required_skills = set(role_req_text.split())
    detected_skills_lower = set(s.lower() for s in detected_skills)
    missing_skills = [s.title() for s in required_skills if s not in detected_skills_lower]
    
    # 4. Recommendation Engine
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
        "summary": f"Your resume scored {ats_score}/100 for the {target_role} role. Focus on learning {', '.join(missing_skills[:3])} to improve your chances.",
        "experienceEvaluation": "We detected some experience, but make sure to use strong action verbs and quantify your achievements."
    }

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
