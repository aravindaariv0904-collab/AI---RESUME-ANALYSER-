import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { LogIn, Mail, Lock } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const res = await axios.post(`${API_URL}/api/auth/login`, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-dark p-8 rounded-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto bg-blue-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-blue-500/50">
            <LogIn className="w-8 h-8 text-blue-400" />
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2">Welcome Back</h2>
          <p className="text-slate-400">Student AI Resume Analyzer</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="email" 
              placeholder="Student Email" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
              required
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 transition-colors"
              required
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-blue-500/25"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:text-blue-300 transition-colors">Register</Link>
        </p>
      </motion.div>
    </div>
  );
}
