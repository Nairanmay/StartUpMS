"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Upload, FileText, CheckCircle, AlertTriangle, Lightbulb, 
  Loader2, Home, Users, ClipboardCheck, DollarSign, PieChart as PieChartIcon, 
  Files, Building2, LogOut, ChevronRight, ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/api";

export default function PitchAnalysisPage() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }
    getUser(token)
      .then((res) => {
        if (res.data.role === "admin") setUser(res.data);
        else router.push("/dashboard");
      })
      .catch(() => router.push("/login"));
  }, [router]);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    setFile(uploadedFile);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    setLoading(true);
    setError(null);

    const token = localStorage.getItem("access");
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("https://backend-ug9v.onrender.com/api/pitchdeck/analyze/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze pitch deck");

      setResult({
        summary: data.analysis_text || "",
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        ratings: data.ratings || {},
        suggestions: data.suggestions || [],
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  // Chart Colors
  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#6366F1"];
  const ratingsData = result ? Object.entries(result.ratings).map(([key, value]) => ({ name: key, value })) : [];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar user={user} />

      <main className="flex-1 ml-72 p-8 md:p-12 transition-all">
        {/* Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-slate-900">Pitch Deck AI</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Pitch Deck Analyzer</h1>
            <p className="text-slate-500 mt-1">Upload your deck to get AI-powered insights and investor ratings.</p>
          </div>
        </header>

        {/* Upload Section (Hidden if Result is shown, or can be kept to re-upload) */}
        {!result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mt-10"
          >
            <form onSubmit={handleSubmit} className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 text-center">
              <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Upload className="w-10 h-10" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-3">Upload your Pitch Deck</h2>
              <p className="text-slate-500 mb-8 max-w-md mx-auto">Supports PDF files up to 10MB. We analyze structure, content, and financial viability.</p>
              
              <label className="block w-full border-2 border-dashed border-slate-200 rounded-2xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group mb-6">
                <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
                <p className="text-slate-600 font-medium group-hover:text-blue-600">
                  {file ? file.name : "Click to select or drag file here"}
                </p>
              </label>

              {error && <p className="text-red-500 text-sm font-medium mb-4 bg-red-50 p-3 rounded-lg">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="animate-spin" /> : "Analyze Pitch Deck"}
              </button>
            </form>
          </motion.div>
        )}

        {/* Results Section */}
        {result && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
             {/* Action Bar */}
             <div className="flex justify-end">
               <button 
                 onClick={() => { setResult(null); setFile(null); }}
                 className="flex items-center gap-2 text-slate-500 hover:text-blue-600 font-medium bg-white px-4 py-2 rounded-lg border border-slate-200 shadow-sm transition"
               >
                 <ArrowLeft className="w-4 h-4" /> Analyze Another
               </button>
             </div>

            {/* Summary Card */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Executive Summary</h3>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{result.summary}</p>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-8">
              {/* Ratings Radar/Bar */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Performance Ratings</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={ratingsData} layout="vertical" margin={{ left: 40, right: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                      <XAxis type="number" domain={[0, 10]} hide />
                      <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12, fill: '#64748b'}} />
                      <ReTooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20}>
                        {ratingsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Ratings Distribution */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-900 mb-6 text-center">Score Distribution</h3>
                <div className="h-80 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={ratingsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {ratingsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ReTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Insights Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100">
                <div className="flex items-center gap-2 mb-4 text-emerald-800">
                  <CheckCircle className="w-5 h-5" />
                  <h3 className="font-bold">Key Strengths</h3>
                </div>
                <ul className="space-y-3">
                  {result.strengths.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-emerald-700">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-emerald-500 rounded-full shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Weaknesses */}
              <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
                <div className="flex items-center gap-2 mb-4 text-red-800">
                  <AlertTriangle className="w-5 h-5" />
                  <h3 className="font-bold">Critical Issues</h3>
                </div>
                <ul className="space-y-3">
                  {result.weaknesses.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-red-700">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggestions */}
              <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-center gap-2 mb-4 text-blue-800">
                  <Lightbulb className="w-5 h-5" />
                  <h3 className="font-bold">Suggestions</h3>
                </div>
                <ul className="space-y-3">
                  {result.suggestions.map((item, i) => (
                    <li key={i} className="flex gap-2 text-sm text-blue-700">
                      <span className="mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full shrink-0"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

// --- Reused Sidebar (Same as Dashboard) ---
function Sidebar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { href: "/admin/employee", label: "Users", icon: <Users className="w-5 h-5" /> },
    { href: "/admin/assign_task", label: "Tasks", icon: <ClipboardCheck className="w-5 h-5" /> },
    { href: "/admin/pitch-deck", label: "Pitch Deck", icon: <FileText className="w-5 h-5" /> },
    { href: "/admin/funding-suggestions", label: "Funding", icon: <DollarSign className="w-5 h-5" /> },
    { href: "/admin/captable", label: "Cap Table", icon: <PieChartIcon className="w-5 h-5" /> },
    { href: "/admin/documents", label: "Documents", icon: <Files className="w-5 h-5" /> },
    { href: "/admin/business_details", label: "Profile", icon: <Building2 className="w-5 h-5" /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-50 flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
           <img src="/logowb.png" alt="Logo" className="h-30 w-auto" />
           {/* <span className="font-bold text-lg text-slate-900 tracking-tight">Startify</span> */}
        </div>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer ${isActive ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                <span className={`transition-colors ${isActive ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600"}`}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-slate-50">
        <div className="bg-slate-50 rounded-xl p-4 mb-3 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{user?.username[0].toUpperCase()}</div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.username}</p>
            <p className="text-xs text-slate-500 truncate">Administrator</p>
          </div>
        </div>
        <button onClick={() => { localStorage.removeItem("access"); router.push("/login"); }} className="flex items-center justify-center gap-2 w-full text-red-600 bg-white border border-red-100 hover:bg-red-50 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}