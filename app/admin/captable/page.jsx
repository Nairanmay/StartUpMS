"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  PieChart, Pie, Cell, Tooltip as ReTooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, XAxis, YAxis
} from "recharts";
import { 
  PieChart as PieIcon, Plus, X, Users, FileText, 
  Home, ClipboardCheck, DollarSign, Files, Building2, 
  LogOut, ChevronRight, Loader2, TrendingUp, Briefcase
} from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/api";

// --- Reusable Sidebar ---
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

// --- Reusable Modal ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- Main Page Component ---
export default function CapTablePage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  
  // Data State
  const [summary, setSummary] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [securities, setSecurities] = useState([]);
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modals
  const [isIssuanceModalOpen, setIssuanceModalOpen] = useState(false);
  const [isStakeholderModalOpen, setStakeholderModalOpen] = useState(false);
  const [isSecurityModalOpen, setSecurityModalOpen] = useState(false);

  // Forms
  const [newIssuance, setNewIssuance] = useState({ stakeholder: "", security: "", number_of_shares: "", date_issued: "" });
  const [newStakeholder, setNewStakeholder] = useState({ name: "", stakeholder_type: "FOUNDER" });
  const [newSecurity, setNewSecurity] = useState({ name: "", authorized_shares: "" });

  const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899"];

  // Fetch Data Helper
  const fetchWithAuth = async (url) => {
    const token = localStorage.getItem("access");
    const res = await fetch(`https://backend-ug9v.onrender.com${url}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error(`API Error: ${res.status}`);
    return res.json();
  };

  const fetchData = useCallback(async () => {
    try {
      // Check User Auth
      const token = localStorage.getItem("access");
      if (!token) { router.push("/login"); return; }
      const userRes = await getUser(token);
      if (userRes.data.role !== "admin") { router.push("/dashboard"); return; }
      setUser(userRes.data);

      // Fetch Cap Table Data
      const [summaryRes, stakeholdersRes, securitiesRes, issuancesRes] = await Promise.all([
        fetchWithAuth("/api/captable/summary/"),
        fetchWithAuth("/api/captable/stakeholders/"),
        fetchWithAuth("/api/captable/securities/"),
        fetchWithAuth("/api/captable/issuances/")
      ]);

      setSummary(summaryRes);
      setStakeholders(stakeholdersRes);
      setSecurities(securitiesRes);
      setIssuances(issuancesRes);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to load Cap Table data.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => { fetchData(); }, [fetchData]);

  // Create Data Helper
  const handleCreate = async (endpoint, data, successCallback) => {
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`https://backend-ug9v.onrender.com/api/captable/${endpoint}/`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify(data)
      });
      
      if (!res.ok) throw new Error("Failed to create entry");
      await fetchData(); // Reload data
      successCallback();
    } catch (err) {
      setError("Operation failed. Please try again.");
    }
  };

  // Submit Handlers
  const handleIssuanceSubmit = (e) => {
    e.preventDefault();
    handleCreate("issuances", newIssuance, () => {
      setNewIssuance({ stakeholder: "", security: "", number_of_shares: "", date_issued: "" });
      setIssuanceModalOpen(false);
    });
  };
  const handleStakeholderSubmit = (e) => {
    e.preventDefault();
    handleCreate("stakeholders", newStakeholder, () => {
      setNewStakeholder({ name: "", stakeholder_type: "FOUNDER" });
      setStakeholderModalOpen(false);
    });
  };
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    handleCreate("securities", newSecurity, () => {
      setNewSecurity({ name: "", authorized_shares: "" });
      setSecurityModalOpen(false);
    });
  };

  // --- Process Data for Charts ---
  const pieChartData = summary?.holdings.map((h) => ({
    name: h.stakeholder_name,
    value: h.ownership_percentage,
  })) || [];

  const lineChartData = useMemo(() => {
    if (issuances.length === 0) return [];
    const sorted = [...issuances].sort((a, b) => new Date(a.date_issued) - new Date(b.date_issued));
    const cumulative = {};
    const timeline = [];

    sorted.forEach((i) => {
      const sName = stakeholders.find((s) => s.id === i.stakeholder)?.name || "Unknown";
      if (!cumulative[sName]) cumulative[sName] = 0;
      cumulative[sName] += Number(i.number_of_shares);
      timeline.push({ date: i.date_issued, ...cumulative });
    });
    return timeline;
  }, [issuances, stakeholders]);

  if (loading || !user) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar user={user} />

      <main className="flex-1 ml-72 p-8 md:p-12 transition-all">
        {/* Header */}
        <header className="mb-10 flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-slate-900">Cap Table</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Equity Management</h1>
            <p className="text-slate-500 mt-1">Track ownership, manage shareholders, and plan dilution.</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button onClick={() => setSecurityModalOpen(true)} className="flex items-center gap-2 bg-white text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 px-4 py-2.5 rounded-xl font-medium transition shadow-sm">
              <Briefcase className="w-4 h-4" /> Securities
            </button>
            <button onClick={() => setStakeholderModalOpen(true)} className="flex items-center gap-2 bg-white text-slate-600 hover:text-blue-600 border border-slate-200 hover:border-blue-200 px-4 py-2.5 rounded-xl font-medium transition shadow-sm">
              <Users className="w-4 h-4" /> Stakeholders
            </button>
            <button onClick={() => setIssuanceModalOpen(true)} className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold transition shadow-lg shadow-blue-200">
              <Plus className="w-4 h-4" /> Issue Shares
            </button>
          </div>
        </header>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            {error}
          </div>
        )}

        <div className="grid xl:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Current Ownership</h3>
            {pieChartData.length > 0 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer>
                  <PieChart>
                    <Pie data={pieChartData} cx="50%" cy="50%" innerRadius={80} outerRadius={120} paddingAngle={3} dataKey="value">
                      {pieChartData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <ReTooltip formatter={(value) => `${value.toFixed(2)}%`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                No data available
              </div>
            )}
          </div>

          {/* Line Chart */}
          <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <h3 className="font-bold text-slate-900 mb-6">Dilution Timeline</h3>
            {lineChartData.length > 0 ? (
              <div className="h-80 w-full">
                <ResponsiveContainer>
                  <LineChart data={lineChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                    <ReTooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                    {stakeholders.map((s, index) => (
                      <Line key={s.id} type="monotone" dataKey={s.name} stroke={COLORS[index % COLORS.length]} strokeWidth={3} dot={false} />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl">
                No issuance history
              </div>
            )}
          </div>
        </div>

        {/* Holdings Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">Cap Table Registry</h3>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Live Updates</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
                <tr>
                  <th className="px-6 py-4">Stakeholder</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4 text-right">Shares Held</th>
                  <th className="px-6 py-4 text-right">Ownership %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {(!summary || summary.holdings.length === 0) ? (
                   <tr><td colSpan="4" className="px-6 py-12 text-center text-slate-400">No shareholders found. Add one to get started.</td></tr>
                ) : (
                  summary.holdings.map((row, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition">
                      <td className="px-6 py-4 font-medium text-slate-900">{row.stakeholder_name}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold
                          ${row.stakeholder_type === "FOUNDER" ? "bg-purple-50 text-purple-700" : 
                            row.stakeholder_type === "INVESTOR" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                          {row.stakeholder_type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-mono text-slate-600">{row.shares_held.toLocaleString()}</td>
                      <td className="px-6 py-4 text-right font-bold text-slate-900">{row.ownership_percentage.toFixed(2)}%</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- MODALS --- */}
        
        {/* 1. Add Security Modal */}
        <Modal isOpen={isSecurityModalOpen} onClose={() => setSecurityModalOpen(false)} title="Add Security Type">
          <form onSubmit={handleSecuritySubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Security Name</label>
              <input className="input-field" type="text" placeholder="e.g. Common Stock" value={newSecurity.name} onChange={(e) => setNewSecurity({ ...newSecurity, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Authorized Shares</label>
              <input className="input-field" type="number" placeholder="e.g. 1000000" value={newSecurity.authorized_shares} onChange={(e) => setNewSecurity({ ...newSecurity, authorized_shares: e.target.value })} required />
            </div>
            <button type="submit" className="btn-primary">Add Security</button>
          </form>
        </Modal>

        {/* 2. Add Stakeholder Modal */}
        <Modal isOpen={isStakeholderModalOpen} onClose={() => setStakeholderModalOpen(false)} title="Add Stakeholder">
          <form onSubmit={handleStakeholderSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
              <input className="input-field" type="text" placeholder="e.g. Jane Doe" value={newStakeholder.name} onChange={(e) => setNewStakeholder({ ...newStakeholder, name: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Category</label>
              <select className="input-field" value={newStakeholder.stakeholder_type} onChange={(e) => setNewStakeholder({ ...newStakeholder, stakeholder_type: e.target.value })} required>
                <option value="FOUNDER">Founder</option>
                <option value="INVESTOR">Investor</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Add Stakeholder</button>
          </form>
        </Modal>

        {/* 3. Issue Shares Modal */}
        <Modal isOpen={isIssuanceModalOpen} onClose={() => setIssuanceModalOpen(false)} title="Issue New Shares">
          <form onSubmit={handleIssuanceSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Stakeholder</label>
              <select className="input-field" value={newIssuance.stakeholder} onChange={(e) => setNewIssuance({ ...newIssuance, stakeholder: e.target.value })} required>
                <option value="">Select...</option>
                {stakeholders.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Security Type</label>
              <select className="input-field" value={newIssuance.security} onChange={(e) => setNewIssuance({ ...newIssuance, security: e.target.value })} required>
                <option value="">Select...</option>
                {securities.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Shares Amount</label>
                <input className="input-field" type="number" placeholder="e.g. 50000" value={newIssuance.number_of_shares} onChange={(e) => setNewIssuance({ ...newIssuance, number_of_shares: e.target.value })} required />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Date Issued</label>
                <input className="input-field" type="date" value={newIssuance.date_issued} onChange={(e) => setNewIssuance({ ...newIssuance, date_issued: e.target.value })} required />
              </div>
            </div>
            <button type="submit" className="btn-primary">Issue Shares</button>
          </form>
        </Modal>

      </main>

      {/* Helper Styles for Inputs/Buttons */}
      <style jsx>{`
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 0.75rem;
          outline: none;
          font-size: 0.875rem;
          transition: all 0.2s;
        }
        .input-field:focus {
          background-color: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        .btn-primary {
          width: 100%;
          padding: 0.875rem;
          background-color: #3b82f6;
          color: white;
          font-weight: 700;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          background-color: #2563eb;
          box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.3);
        }
      `}</style>
    </div>
  );
}