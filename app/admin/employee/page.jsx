"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  Users, UserPlus, Search, Trash2, Mail, Shield, 
  User, Home, ClipboardCheck, FileText, DollarSign, 
  PieChart, Files, Building2, LogOut, ChevronRight, 
  Loader2, X, MoreVertical
} from "lucide-react";
import Link from "next/link";
import { getUser, getUsersByCompany } from "@/lib/api";

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
    { href: "/admin/captable", label: "Cap Table", icon: <PieChart className="w-5 h-5" /> },
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

// --- Reusable Modal ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
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
export default function EmployeePage() {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const [newUser, setNewUser] = useState({
    username: "",
    email: "",
    password: "",
    role: "user"
  });

  // Auth & Fetch
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { router.push("/login"); return; }

    async function init() {
      try {
        const userRes = await getUser(token);
        if (userRes.data.role !== "admin") { router.push("/dashboard"); return; }
        setUser(userRes.data);

        // Fetch Employees
        if (userRes.data.company_code) {
          const data = await getUsersByCompany(userRes.data.company_code);
          setEmployees(data);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  // Handlers
  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      // Create payload. Admin creates user with current company code.
      const payload = { ...newUser, company_code: user.company_code };
      
      const res = await fetch("https://backend-ug9v.onrender.com/auth/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, password1: newUser.password, password2: newUser.password })
      });

      if (res.ok) {
        // Refresh List
        const updatedList = await getUsersByCompany(user.company_code);
        setEmployees(updatedList);
        setIsModalOpen(false);
        setNewUser({ username: "", email: "", password: "", role: "user" });
      } else {
        const errData = await res.json();
        alert(`Error: ${JSON.stringify(errData)}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`https://backend-ug9v.onrender.com/users/delete/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setEmployees(employees.filter(e => e.id !== id));
      }
    } catch (err) {
      alert("Failed to delete user");
    }
  };

  // --- SORTING LOGIC ADDED HERE ---
  const filteredEmployees = employees
    .filter(e => 
      e.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      // 1. Sort by Role: 'admin' first
      if (a.role === 'admin' && b.role !== 'admin') return -1;
      if (a.role !== 'admin' && b.role === 'admin') return 1;
      
      // 2. Secondary Sort: Username Alphabetical (A-Z)
      return a.username.localeCompare(b.username);
    });

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar user={user} />

      <main className="flex-1 ml-72 p-8 md:p-12 transition-all">
        {/* Header */}
        <header className="mb-10 flex justify-between items-end">
          <div>
            <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
              <Home className="w-4 h-4" />
              <ChevronRight className="w-4 h-4" />
              <span>Admin</span>
              <ChevronRight className="w-4 h-4" />
              <span className="font-medium text-slate-900">Team</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Team Management</h1>
            <p className="text-slate-500 mt-1">Manage access and roles for your startup members.</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200"
          >
            <UserPlus className="w-4 h-4" /> Add Member
          </button>
        </header>

        {/* Stats Row */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Members</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{employees.length}</p>
            </div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl"><Users className="w-5 h-5" /></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Administrators</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{employees.filter(e => e.role === 'admin').length}</p>
            </div>
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl"><Shield className="w-5 h-5" /></div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
             <div>
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Company Code</p>
               <p className="text-xl font-mono font-bold text-slate-900 mt-1">{user.company_code}</p>
             </div>
             <div className="p-3 bg-green-50 text-green-600 rounded-xl"><Building2 className="w-5 h-5" /></div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Employees Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Member</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan="4">
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <Users className="w-12 h-12 mb-3 opacity-20" />
                      <p>No team members found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="hover:bg-slate-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                          {emp.username.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{emp.username}</p>
                          <p className="text-xs text-slate-400">{emp.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold capitalize
                        ${emp.role === 'admin' ? 'bg-purple-50 text-purple-700' : 'bg-blue-50 text-blue-700'}`}>
                        {emp.role === 'admin' && <Shield className="w-3 h-3" />}
                        {emp.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => handleDelete(emp.id)}
                        disabled={emp.id === user.id} // Cannot delete self
                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Remove User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Add User Modal */}
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Member">
          <form onSubmit={handleAddUser} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  required
                  placeholder="e.g. johndoe" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  value={newUser.username}
                  onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                />
              </div>
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="email" 
                  required
                  placeholder="john@company.com" 
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  value={newUser.email}
                  onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Role</label>
                <select 
                  className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                >
                  <option value="user">Employee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
                  value={newUser.password}
                  onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 mt-4"
            >
              <UserPlus className="w-4 h-4" /> Create Account
            </button>
          </form>
        </Modal>

      </main>
    </div>
  );
}