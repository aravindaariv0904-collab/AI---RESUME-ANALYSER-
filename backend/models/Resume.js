const mongoose = require('mongoose');

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  originalFilename: { type: String, required: true },
  mimeType: { type: String, required: true },
  sizeBytes: { type: Number, required: true },
  uploadDate: { type: Date, default: Date.now },
  // Note: Actual file binary is not stored here per requirements.
}, { timestamps: true });

module.exports = mongoose.model('Resume', ResumeSchema);
