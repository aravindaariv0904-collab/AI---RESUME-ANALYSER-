import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_analyze_endpoint_missing_file():
    # Sending request without file should fail
    response = client.post("/analyze", data={"target_role": "Software Engineer"})
    assert response.status_code == 422 # Unprocessable Entity

def test_analyze_endpoint_success_text_fallback():
    # Sending dummy text file
    payload = {"target_role": "Software Engineer"}
    files = {"file": ("resume.txt", b"Python JavaScript developer React Node.js SQL algorithms")}
    
    response = client.post("/analyze", data=payload, files=files)
    assert response.status_code == 200
    
    data = response.json()
    assert "score" in data
    assert "skills" in data
    assert "missingSkills" in data
    assert "summary" in data
    assert len(data["skills"]) > 0
    # Should find Python, JavaScript, React, Node.Js, Sql
    assert "Python" in data["skills"]
    assert "React" in data["skills"]

def test_analyze_endpoint_empty_resume():
    payload = {"target_role": "Software Engineer"}
    files = {"file": ("resume.txt", b"")}
    
    response = client.post("/analyze", data=payload, files=files)
    assert response.status_code == 200
    
    data = response.json()
    assert "score" in data
    assert data["score"] == 15 # base low score for empty skills
    assert len(data["skills"]) == 0
