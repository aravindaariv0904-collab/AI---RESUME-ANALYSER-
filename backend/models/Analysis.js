const mongoose = require('mongoose');

const AnalysisSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  targetRole: { type: String, required: true },
  originalFilename: { type: String, required: true },
  score: { type: Number, required: true },
  skills: [String],
  missingSkills: [String],
  skillsToLearn: [String],
  projectSuggestions: [String],
  hackathonsAndInternships: [String],
  strengths: [String],
  weaknesses: [String],
  summary: { type: String },
  experienceEvaluation: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Analysis', AnalysisSchema);
