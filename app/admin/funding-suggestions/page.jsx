"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { 
  DollarSign, TrendingUp, PieChart as PieIcon, Activity, 
  CheckCircle, Briefcase, Building2, Home, Users, 
  ClipboardCheck, FileText, Files, LogOut, ChevronRight, Loader2
} from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/api";

export default function FundingPage() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    company_name: "",
    company_type: "",
    company_phase: "",
    founder_equity: "",
    funds_required: "",
  });

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

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // setResult(null); // Optional: Keep previous result visible while loading new one

    try {
      const res = await fetch("https://backend-ug9v.onrender.com/api/funding/suggest/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          founder_equity: parseFloat(formData.founder_equity),
          funds_required: parseFloat(formData.funds_required),
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Failed to fetch funding suggestions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444"];

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar user={user} />

      <main className="flex-1 ml-72 p-8 md:p-12 transition-all">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-900">Funding Advisor</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">AI Funding Strategy</h1>
          <p className="text-slate-500 mt-1">Get AI-powered recommendations for your next funding round.</p>
        </header>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* LEFT COLUMN: Input Form */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><DollarSign className="w-5 h-5" /></div>
                <h2 className="font-bold text-slate-900">Company Details</h2>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name</label>
                  <input
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm font-medium"
                    name="company_name"
                    placeholder="e.g. Acme Corp"
                    value={formData.company_name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Industry</label>
                    <select
                      name="company_type"
                      value={formData.company_type}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="SaaS">SaaS</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Fintech">Fintech</option>
                      <option value="HealthTech">HealthTech</option>
                      <option value="AI/ML">AI/ML</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stage</label>
                    <select
                      name="company_phase"
                      value={formData.company_phase}
                      onChange={handleChange}
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                      required
                    >
                      <option value="">Select...</option>
                      <option value="Pre-seed">Pre-seed</option>
                      <option value="Seed">Seed</option>
                      <option value="Series A">Series A</option>
                      <option value="Growth">Growth</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Founder Equity (%)</label>
                  <select
                    name="founder_equity"
                    value={formData.founder_equity}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    required
                  >
                    <option value="">Select Equity</option>
                    {[...Array(21)].map((_, i) => (
                      <option key={i} value={i * 5}>{i * 5}%</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Funds Required (₹)</label>
                  <select
                    name="funds_required"
                    value={formData.funds_required}
                    onChange={handleChange}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm"
                    required
                  >
                    <option value="">Select Amount</option>
                    <option value="500000">₹5 Lakhs</option>
                    <option value="1000000">₹10 Lakhs</option>
                    <option value="2500000">₹25 Lakhs</option>
                    <option value="5000000">₹50 Lakhs</option>
                    <option value="10000000">₹1 Crore</option>
                    <option value="50000000">₹5 Crores</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Generate Strategy"}
                </button>
              </form>
              
              {error && <p className="mt-4 text-xs text-red-500 bg-red-50 p-2 rounded-lg text-center font-medium">{error}</p>}
            </div>
          </div>

          {/* RIGHT COLUMN: Results */}
          <div className="lg:col-span-8 space-y-6">
            {!result ? (
              // Empty State
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-200 p-8 text-center">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4">
                  <Activity className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-semibold text-slate-600">No Analysis Yet</h3>
                <p className="max-w-xs mx-auto text-sm mt-1">Fill out your company details to generate a personalized funding strategy.</p>
              </div>
            ) : (
              // Results View
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Key Metrics Cards */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended Source</p>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">{result.investor_type}</h3>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-start gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                      <PieIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Equity Dilution</p>
                      <h3 className="text-xl font-bold text-slate-900 mt-1">{result.equity_to_dilute}%</h3>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100">
                  <div className="flex items-center gap-2 mb-3 text-blue-800">
                    <TrendingUp className="w-5 h-5" />
                    <h3 className="font-bold">Strategy Analysis</h3>
                  </div>
                  <p className="text-blue-900/80 text-sm leading-relaxed">{result.explanation}</p>
                </div>

                {/* Charts */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Pie Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 text-center">Post-Funding Ownership</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={result.graphs_data.pie_chart}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                          >
                            {result.graphs_data.pie_chart.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <ReTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Legend verticalAlign="bottom" iconType="circle" />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  {/* Bar Chart */}
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-bold text-slate-900 mb-6 text-center">Dilution Impact</h3>
                    <div className="h-64 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.graphs_data.bar_chart}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                          <ReTooltip cursor={{fill: '#f1f5f9'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="Before" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="After" fill="#10B981" radius={[4, 4, 0, 0]} />
                          <Legend verticalAlign="bottom" iconType="circle" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// --- Reused Sidebar Component ---
function Sidebar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const navItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { href: "/admin/employee", label: "Users", icon: <Users className="w-5 h-5" /> },
    { href: "/admin/assign_task", label: "Tasks", icon: <ClipboardCheck className="w-5 h-5" /> },
    { href: "/admin/pitch-deck", label: "Pitch Deck", icon: <FileText className="w-5 h-5" /> },
    { href: "/admin/funding-suggestions", label: "Funding", icon: <DollarSign className="w-5 h-5" /> },
    { href: "/admin/captable", label: "Cap Table", icon: <PieIcon className="w-5 h-5" /> },
    { href: "/admin/documents", label: "Documents", icon: <Files className="w-5 h-5" /> },
    { href: "/admin/business_details", label: "Profile", icon: <Building2 className="w-5 h-5" /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-50 flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
           <img src="/logowb.png" alt="Logo" className="h-8 w-auto" />
           <span className="font-bold text-lg text-slate-900 tracking-tight">Startify</span>
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