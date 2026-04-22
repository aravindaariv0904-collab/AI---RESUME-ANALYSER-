import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Target, Zap, ChevronRight } from 'lucide-react';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-emerald-600/20 blur-[120px] pointer-events-none" />

      {/* Navigation */}
      <nav className="relative z-50 border-b border-white/5 backdrop-blur-xl bg-[#0f172a]/50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">RESUME.AI</span>
          </div>
          <button 
            onClick={() => navigate('/analyzer')}
            className="group flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-2.5 rounded-full font-medium transition-all"
          >
            Launch Analyzer
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 px-6 text-center max-w-5xl mx-auto z-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
          </span>
          AI-Powered Student Edition
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-[1.1] tracking-tight">
          Unlock your dream role with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-emerald-400">
            Precision Intelligence.
          </span>
        </h1>
        
        <p className="text-xl text-slate-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          The ultimate ATS-focused analyzer built specifically for students. Identify critical skill gaps, receive targeted project recommendations, and land your next big internship.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-5">
          <button 
            onClick={() => navigate('/analyzer')}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl text-lg font-bold hover:shadow-lg hover:shadow-blue-500/25 transition-all hover:-translate-y-0.5"
          >
            Start Free Analysis
            <ChevronRight className="w-5 h-5" />
          </button>
          <button className="flex items-center justify-center gap-2 bg-slate-800/50 text-white border border-slate-700 px-8 py-4 rounded-2xl text-lg font-bold hover:bg-slate-800 transition-colors">
            View Sample Report
          </button>
        </div>
      </header>

      {/* Features Grid */}
      <section className="relative py-24 px-6 max-w-7xl mx-auto z-10">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Target className="w-8 h-8 text-blue-400" />}
            title="ATS Optimization"
            desc="Our AI simulates real-world Applicant Tracking Systems to give you an honest, actionable score."
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-emerald-400" />}
            title="Skill Gap Detection"
            desc="Instantly find out which technical skills are missing for your specific target role in seconds."
          />
          <FeatureCard 
            icon={<FileText className="w-8 h-8 text-indigo-400" />}
            title="Project Roadmap"
            desc="Receive custom project ideas designed to help you seamlessly bridge your unique skill gaps."
          />
        </div>
      </section>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <div className="p-8 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-[2rem] hover:border-slate-500/50 hover:bg-slate-800/60 transition-all group">
    <div className="w-16 h-16 rounded-2xl bg-slate-900/80 flex items-center justify-center mb-6 border border-white/5 group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <h3 className="text-2xl font-bold mb-4 text-slate-100">{title}</h3>
    <p className="text-slate-400 leading-relaxed">{desc}</p>
  </div>
);

export default Landing;
