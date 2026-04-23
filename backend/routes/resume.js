const express = require('express');
const router = express.Router();
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const auth = require('../middleware/auth');
const Analysis = require('../models/Analysis');

const upload = multer({ storage: multer.memoryStorage() });
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

// @route   POST api/resume/analyze
// @desc    Upload resume and get analysis
router.post('/analyze', auth, upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    const targetRole = req.body.targetRole || 'Software Engineer';

    if (!file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const form = new FormData();
    form.append('file', file.buffer, { filename: file.originalname });
    form.append('target_role', targetRole);

    // Call AI Service (Python FastAPI)
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze`, form, {
      headers: { ...form.getHeaders() }
    });

    const aiData = aiResponse.data;

    // Save to MongoDB
    const analysis = new Analysis({
      userId: req.user.id,
      targetRole,
      originalFilename: file.originalname,
      score: aiData.score,
      skills: aiData.skills,
      missingSkills: aiData.missingSkills,
      skillsToLearn: aiData.skillsToLearn,
      projectSuggestions: aiData.projectSuggestions,
      hackathonsAndInternships: aiData.hackathonsAndInternships,
      strengths: aiData.strengths,
      weaknesses: aiData.weaknesses,
      summary: aiData.summary,
      experienceEvaluation: aiData.experienceEvaluation
    });

    await analysis.save();

    res.json(analysis);
  } catch (error) {
    console.error('Error analyzing resume:', error.message);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

// @route   GET api/resume/history
// @desc    Get user's past analyses
router.get('/history', auth, async (req, res) => {
  try {
    const analyses = await Analysis.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
