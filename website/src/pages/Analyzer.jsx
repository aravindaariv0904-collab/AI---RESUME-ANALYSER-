import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UploadCloud, File, AlertCircle, CheckCircle2, ArrowLeft, Loader2 } from 'lucide-react';

const Analyzer = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [role, setRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.type === 'application/pdf') {
      setFile(selected);
      setError('');
    } else {
      setError('Please upload a valid PDF file.');
      setFile(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please select a resume to analyze.');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', role);

    try {
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
      const response = await axios.post(`${API_URL}/api/analyze`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to analyze resume. Make sure backend and AI service are running.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="min-h-screen bg-[#0f172a] text-white p-6 md:p-12">
        <div className="max-w-5xl mx-auto">
          <button 
            onClick={() => setResult(null)} 
            className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Upload
          </button>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-[2rem] text-center flex flex-col justify-center items-center">
              <h3 className="text-slate-400 font-medium mb-4">ATS Match Score</h3>
              <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-400">
                {result.score}%
              </div>
              <p className="text-sm text-slate-500 mt-4">Target: {result.targetRole || role}</p>
            </div>
            
            {/* Summary */}
            <div className="md:col-span-2 bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 p-8 rounded-[2rem]">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                AI Summary
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg">{result.summary}</p>
            </div>

            {/* Skills */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-[2rem]">
              <h4 className="font-bold mb-6 text-emerald-400 flex items-center gap-2">
                Found Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.skills.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-sm font-medium border border-emerald-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-[2rem]">
              <h4 className="font-bold mb-6 text-orange-400 flex items-center gap-2">
                Missing Skills
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills.map(s => (
                  <span key={s} className="px-3 py-1.5 bg-orange-500/10 text-orange-400 rounded-lg text-sm font-medium border border-orange-500/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>

            {/* Recommendations */}
            <div className="bg-slate-800/50 border border-slate-700/50 p-8 rounded-[2rem]">
              <h4 className="font-bold mb-6 text-blue-400 flex items-center gap-2">
                Next Steps
              </h4>
              <ul className="space-y-4">
                {result.recommendations.map((r, i) => (
                  <li key={i} className="flex gap-3 text-slate-300 text-sm">
                    <div className="mt-1 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-xl w-full relative z-10">
        <button 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-slate-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </button>

        <div className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 p-10 rounded-[2.5rem] shadow-2xl">
          <h2 className="text-3xl font-bold mb-2">Upload Resume</h2>
          <p className="text-slate-400 mb-8">Upload your PDF resume to get instant AI feedback.</p>

          <div className="space-y-6">
            {/* Role Input */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
              <input 
                type="text" 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="e.g. Data Scientist"
              />
            </div>

            {/* Upload Area */}
            <div className="relative">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className={`border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${file ? 'border-blue-500 bg-blue-500/5' : 'border-slate-700 hover:border-slate-500 bg-slate-900/30'}`}>
                {file ? (
                  <div className="flex flex-col items-center gap-2">
                    <File className="w-10 h-10 text-blue-400" />
                    <span className="font-medium text-slate-200">{file.name}</span>
                    <span className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <UploadCloud className="w-12 h-12 text-slate-400" />
                    <div>
                      <span className="font-medium text-blue-400">Click to upload</span> or drag and drop
                    </div>
                    <span className="text-sm text-slate-500">PDF only (Max 5MB)</span>
                  </div>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-4 rounded-xl border border-red-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <button 
              onClick={handleAnalyze}
              disabled={loading || !file}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing with AI...
                </>
              ) : (
                'Analyze Resume'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
