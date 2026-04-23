import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Upload, FileText, CheckCircle, XCircle, BookOpen, Briefcase, Award, Zap, AlertTriangle, ChevronRight, LogOut, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [file, setFile] = useState(null);
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('resume', file);
    formData.append('targetRole', targetRole);

    try {
      const token = localStorage.getItem('token');
      const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:5000' : '');
      const res = await axios.post(`${API_URL}/api/resume/analyze`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'x-auth-token': token
        }
      });
      setResult(res.data);
    } catch (err) {
      console.error(err);
      alert('Error analyzing resume');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-6 md:p-10">
      <header className="flex justify-between items-center mb-10 glass px-6 py-4 rounded-2xl">
        <div>
          <h1 className="text-2xl font-bold text-gradient">AI Resume Analyzer</h1>
          <p className="text-sm text-slate-400">Welcome, {user.name || 'Student'}</p>
        </div>
        <button 
          onClick={handleLogout}
          className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors bg-slate-800/50 px-4 py-2 rounded-lg"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </header>

      {!result ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="glass-dark p-8 rounded-3xl border border-blue-500/20 shadow-[0_0_40px_rgba(59,130,246,0.1)]">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 mb-4">
                <FileText className="w-8 h-8 text-blue-400" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Upload Your Resume</h2>
              <p className="text-slate-400">Get an instant AI-powered analysis for your target role.</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Target Role</label>
                <select 
                  className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-blue-500 appearance-none"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="Software Engineer">Software Engineer</option>
                  <option value="Data Scientist">Data Scientist</option>
                  <option value="Web Developer">Web Developer</option>
                  <option value="Product Manager">Product Manager</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Resume File (PDF/DOCX)</label>
                <div className="relative border-2 border-dashed border-slate-600 rounded-xl p-8 text-center hover:border-blue-500 transition-colors bg-slate-800/30">
                  <input 
                    type="file" 
                    accept=".pdf,.docx" 
                    onChange={(e) => setFile(e.target.files[0])}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    required
                  />
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-3" />
                  <p className="text-slate-300 font-medium">
                    {file ? file.name : "Drag & drop or click to browse"}
                  </p>
                  {!file && <p className="text-slate-500 text-sm mt-1">PDF or DOCX up to 5MB</p>}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={!file || loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-semibold py-4 rounded-xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2"
              >
                {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing with AI...</> : 'Analyze Resume'}
              </button>
            </form>
          </div>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-6xl mx-auto space-y-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Analysis Results for <span className="text-blue-400">{result.targetRole}</span></h2>
            <button 
              onClick={() => {setResult(null); setFile(null);}}
              className="text-sm bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-lg transition-colors"
            >
              Analyze Another
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Score Card */}
            <div className="glass p-6 rounded-2xl flex flex-col items-center justify-center border-t-4 border-t-blue-500 text-center">
              <div className="w-32 h-32 rounded-full border-8 border-slate-800 flex items-center justify-center relative mb-4">
                <svg className="absolute top-0 left-0 w-full h-full -rotate-90">
                  <circle cx="50%" cy="50%" r="46%" fill="none" stroke="#3b82f6" strokeWidth="8" strokeDasharray={`${(result.score / 100) * 289} 289`} className="transition-all duration-1000 ease-out" strokeLinecap="round" />
                </svg>
                <span className="text-4xl font-bold text-white">{result.score}</span>
              </div>
              <h3 className="text-xl font-semibold mb-1">ATS Match Score</h3>
              <p className="text-slate-400 text-sm">Based on {result.targetRole} requirements</p>
            </div>

            {/* Strengths & Weaknesses */}
            <div className="glass p-6 rounded-2xl md:col-span-2">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Zap className="text-yellow-400 w-5 h-5"/> Profile Overview</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl">
                  <h4 className="font-medium text-emerald-400 flex items-center gap-2 mb-2"><CheckCircle className="w-4 h-4"/> Strengths</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {result.strengths?.map((s, i) => <li key={i}>• {s}</li>)}
                    {(!result.strengths || result.strengths.length === 0) && <li>No specific strengths detected.</li>}
                  </ul>
                </div>
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
                  <h4 className="font-medium text-red-400 flex items-center gap-2 mb-2"><AlertTriangle className="w-4 h-4"/> Areas for Improvement</h4>
                  <ul className="space-y-1 text-sm text-slate-300">
                    {result.weaknesses?.map((w, i) => <li key={i}>• {w}</li>)}
                    {(!result.weaknesses || result.weaknesses.length === 0) && <li>No critical weaknesses detected.</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Skills */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><CheckCircle className="text-blue-400 w-5 h-5"/> Skills Detected</h3>
              <div className="flex flex-wrap gap-2">
                {result.skills?.map((skill, i) => (
                  <span key={i} className="bg-blue-500/20 border border-blue-500/30 text-blue-300 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                {(!result.skills || result.skills.length === 0) && <span className="text-slate-400 text-sm">No specific skills detected.</span>}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><XCircle className="text-red-400 w-5 h-5"/> Missing Skills</h3>
              <div className="flex flex-wrap gap-2">
                {result.missingSkills?.map((skill, i) => (
                  <span key={i} className="bg-red-500/20 border border-red-500/30 text-red-300 px-3 py-1 rounded-full text-sm">
                    {skill}
                  </span>
                ))}
                {(!result.missingSkills || result.missingSkills.length === 0) && <span className="text-emerald-400 text-sm">You have all the required core skills!</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Recommendations */}
            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><BookOpen className="text-indigo-400 w-5 h-5"/> Skills to Learn</h3>
              <ul className="space-y-3">
                {result.skillsToLearn?.map((skill, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    Focus on learning {skill}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Briefcase className="text-orange-400 w-5 h-5"/> Project Ideas</h3>
              <ul className="space-y-3">
                {result.projectSuggestions?.map((proj, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                    {proj}
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass p-6 rounded-2xl">
              <h3 className="text-lg font-semibold flex items-center gap-2 mb-4"><Award className="text-emerald-400 w-5 h-5"/> Next Steps</h3>
              <ul className="space-y-3">
                {result.hackathonsAndInternships?.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                    <ChevronRight className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="glass p-6 rounded-2xl bg-gradient-to-r from-blue-900/40 to-indigo-900/40 border-none">
            <h3 className="text-lg font-semibold mb-2">Final Summary</h3>
            <p className="text-slate-300 mb-4">{result.summary}</p>
            <div className="bg-slate-900/50 p-4 rounded-xl">
              <p className="text-sm text-slate-400"><span className="font-semibold text-white">Experience Note:</span> {result.experienceEvaluation}</p>
            </div>
          </div>

        </motion.div>
      )}
    </div>
  );
}
