const express = require('express');
const cors = require('cors');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

const app = express();
const PORT = process.env.PORT || 5000;
const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';

app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/analyze', upload.single('resume'), async (req, res) => {
  try {
    const file = req.file;
    const targetRole = req.body.targetRole || 'Software Engineer';

    if (!file) {
      return res.status(400).json({ error: 'Resume file is required' });
    }

    const form = new FormData();
    form.append('file', file.buffer, { filename: file.originalname });
    form.append('target_role', targetRole);

    // Call AI Service (Python FastAPI) running on port 8000
    const aiResponse = await axios.post(`${AI_SERVICE_URL}/analyze`, form, {
      headers: { ...form.getHeaders() }
    });

    // Mocking MongoDB storage here for simplicity in this MVP
    // A real app would save aiResponse.data to the database

    res.json(aiResponse.data);
  } catch (error) {
    console.error('Error calling AI service:', error.message);
    res.status(500).json({ error: 'Failed to analyze resume' });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
