import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserPlus, User, Mail, Lock, GraduationCap, Calendar } from 'lucide-react';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', university: '', graduationYear: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-dark p-8 rounded-2xl w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="mx-auto bg-emerald-500/20 w-16 h-16 rounded-full flex items-center justify-center mb-4 border border-emerald-500/50">
            <UserPlus className="w-8 h-8 text-emerald-400" />
          </div>
          <h2 className="text-3xl font-bold text-gradient mb-2">Create Account</h2>
          <p className="text-slate-400">Join the AI Resume Analyzer</p>
        </div>

        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-6 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
              onChange={e => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="email" 
              placeholder="Student Email" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
              onChange={e => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              required
              onChange={e => setFormData({...formData, password: e.target.value})}
            />
          </div>
          <div className="relative">
            <GraduationCap className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="University" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              onChange={e => setFormData({...formData, university: e.target.value})}
            />
          </div>
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Graduation Year" 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-emerald-500 transition-colors"
              onChange={e => setFormData({...formData, graduationYear: e.target.value})}
            />
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-semibold py-3 rounded-lg transition-all transform active:scale-95 shadow-lg shadow-emerald-500/25 mt-2"
          >
            Register
          </button>
        </form>

        <p className="mt-6 text-center text-slate-400 text-sm">
          Already have an account? <Link to="/login" className="text-emerald-400 hover:text-emerald-300 transition-colors">Sign In</Link>
        </p>
      </motion.div>
    </div>
  );
}
