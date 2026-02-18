"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Home, CheckSquare, FileText, Building2, LayoutDashboard, 
  LogOut, Bell, Flame, Calendar, ArrowRight, Loader2, 
  TrendingUp, CheckCircle, Clock, RefreshCw, AlertCircle
} from "lucide-react";
import Link from "next/link";
import { getUser } from "@/lib/api";

// --- Sidebar ---
function UserSidebar({ user }) {
  const router = useRouter();
  const handleLogout = () => { localStorage.removeItem("access"); router.push("/login"); };

  const navItems = [
    { href: "/dashboard", label: "My Dashboard", icon: <Home className="w-5 h-5" /> },
    { href: "/view_task", label: "My Tasks", icon: <CheckSquare className="w-5 h-5" /> },
    { href: "/dashboard/documents", label: "Documents", icon: <FileText className="w-5 h-5" /> },
    { href: "/dashboard/business_details", label: "Company Info", icon: <Building2 className="w-5 h-5" /> },
    { href: "/dashboard/profile", label: "My Profile", icon: <LayoutDashboard className="w-5 h-5" /> },
  ];

  return (
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-50 hidden lg:flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-slate-50">
        <div className="flex items-center gap-3">
           <img src="/logowb.png" alt="Logo" className="h-8 w-auto" />
           <span className="font-bold text-lg text-slate-900 tracking-tight">Startify</span>
        </div>
      </div>
      <div className="p-6">
        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">{user?.username?.[0]?.toUpperCase()}</div>
          <div className="overflow-hidden"><p className="text-sm font-bold text-slate-900 truncate">{user?.username}</p><p className="text-xs text-blue-600 font-medium">Employee</p></div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${window.location.pathname === item.href ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
                {item.icon}{item.label}
              </div>
            </Link>
          ))}
        </nav>
      </div>
      <div className="mt-auto p-6 border-t border-slate-50">
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full text-slate-600 bg-slate-50 hover:bg-red-50 hover:text-red-600 font-medium px-4 py-3 rounded-xl transition-colors text-sm"><LogOut className="w-4 h-4" /> Sign Out</button>
      </div>
    </aside>
  );
}

// --- Time Greeting Helper ---
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
};

export default function UserDashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // 1. Fetch Data Function (FIXED 401 HANDLING)
  const loadData = async () => {
    const token = localStorage.getItem("access");
    if (!token) { router.push("/login"); return; }
    
    setRefreshing(true);
    try {
        const userRes = await getUser(token);
        setUser(userRes.data);
        if (userRes.data.role === 'admin') { router.push('/admin/dashboard'); return; }

        // Fetch Tasks
        try {
            const tasksRes = await fetch("https://backend-ug9v.onrender.com/api/tasks/my_tasks/", { headers: { Authorization: `Bearer ${token}` } });
            if (tasksRes.ok) setTasks(await tasksRes.json());
            else {
                const all = await fetch("https://backend-ug9v.onrender.com/api/tasks/", { headers: { Authorization: `Bearer ${token}` } });
                if(all.ok) {
                    const data = await all.json();
                    setTasks(data.filter(t => Array.isArray(t.assigned_to_ids) ? t.assigned_to_ids.includes(userRes.data.id) : t.assigned_to === userRes.data.id));
                }
            }
        } catch (e) { console.warn(e); }
    } catch (err) { 
        console.error("Dashboard Load Error:", err);
        // --- THIS FIXES THE CRASH ---
        if (err.response && err.response.status === 401) {
            localStorage.removeItem("access"); // Clear bad token
            router.push("/login"); // Force login
        }
    } 
    finally { 
        setLoading(false); 
        setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [router]);

  // 2. Handle Quick Complete from Dashboard
  const handleQuickComplete = async (taskId) => {
    const previousTasks = [...tasks];
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: "Completed" } : t));

    try {
        const token = localStorage.getItem("access");
        const res = await fetch(`https://backend-ug9v.onrender.com/api/tasks/${taskId}/`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ status: "Completed" })
        });
        if (!res.ok) throw new Error("Failed");
    } catch (err) {
        setTasks(previousTasks);
        alert("Failed to update task.");
    }
  };

  // --- STATS LOGIC ---
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => (t.status || "").toLowerCase() === 'completed');
  const pendingTasks = tasks.filter(t => (t.status || "").toLowerCase() !== 'completed');
  
  const completedCount = completedTasks.length;
  const pendingCount = pendingTasks.length;
  
  const efficiency = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  
  const efficiencyColor = efficiency >= 80 ? "text-green-600 bg-green-50" : efficiency >= 50 ? "text-blue-600 bg-blue-50" : "text-orange-600 bg-orange-50";
  const efficiencyBarColor = efficiency >= 80 ? "bg-green-500" : efficiency >= 50 ? "bg-blue-500" : "bg-orange-500";

  // Focus Task Logic
  const highPriority = pendingTasks.filter(t => t.priority === 'High');
  const focusTask = highPriority.length > 0 ? highPriority[0] : pendingTasks[0];

  if (loading || !user) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <UserSidebar user={user} />
      
      <main className="flex-1 lg:ml-72 p-8 md:p-12 transition-all">
        {/* Header */}
        <header className="mb-12 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{getGreeting()}, {user.username} ☀️</h1>
                <p className="text-slate-500 mt-1">Here is your daily performance summary.</p>
            </div>
            <div className="flex items-center gap-4">
                <button 
                    onClick={loadData}
                    disabled={refreshing}
                    className="p-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 transition disabled:animate-spin"
                    title="Refresh Data"
                >
                    <RefreshCw className="w-5 h-5" />
                </button>
                <div className="bg-white p-2.5 rounded-full border border-slate-100 shadow-sm relative">
                    <Bell className="w-5 h-5 text-slate-400" />
                    {pendingCount > 0 && <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                </div>
            </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            
            {/* LEFT COLUMN */}
            <div className="xl:col-span-2 space-y-8">
                
                {/* 1. FOCUS CARD */}
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <Flame className="w-5 h-5 text-orange-500" />
                        <h2 className="font-bold text-slate-900 text-lg">Focus Mode</h2>
                    </div>
                    {focusTask ? (
                        <div className="bg-slate-900 rounded-3xl p-8 text-white shadow-xl shadow-slate-200 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-20 group-hover:opacity-30 transition duration-700"></div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-start mb-6">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${focusTask.priority === 'High' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 'bg-blue-500/20 border-blue-500/30 text-blue-200'}`}>
                                        {focusTask.priority || 'Normal'} Priority
                                    </span>
                                    <span className="text-slate-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> Due {focusTask.deadline ? new Date(focusTask.deadline).toLocaleDateString() : 'Soon'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 leading-snug">{focusTask.title}</h3>
                                <p className="text-slate-400 text-sm mb-8 line-clamp-2 max-w-lg">{focusTask.description}</p>
                                <div className="flex gap-4">
                                    {/* Action 1: Mark Complete directly */}
                                    <button 
                                        onClick={() => handleQuickComplete(focusTask.id)}
                                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-50 hover:text-green-700 transition flex items-center gap-2 shadow-lg shadow-white/10"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Mark Done
                                    </button>
                                    
                                    {/* Action 2: View Details */}
                                    <Link href="/dashboard/tasks" className="text-slate-300 px-4 py-3 rounded-xl font-bold text-sm border border-slate-700 hover:bg-slate-800 transition">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ) : (
                         <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-xl shadow-emerald-200 flex flex-col items-center justify-center text-center h-64">
                             <CheckCircle className="w-16 h-16 text-emerald-200 mb-4" />
                             <h3 className="text-2xl font-bold mb-2">All Caught Up! 🎉</h3>
                             <p className="text-emerald-100 max-w-sm">No tasks pending. Your dashboard is clear.</p>
                         </div>
                    )}
                </section>

                {/* 2. STATS OVERVIEW */}
                <section>
                    <h2 className="font-bold text-slate-900 text-lg mb-4">Performance Overview</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        
                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Pending</p>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold text-slate-900">{pendingCount}</span>
                                <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Clock className="w-5 h-5" /></div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Completed</p>
                            <div className="flex items-end justify-between">
                                <span className="text-3xl font-bold text-slate-900">{completedCount}</span>
                                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><CheckCircle className="w-5 h-5" /></div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition hover:shadow-md">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Efficiency</p>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-3xl font-bold text-slate-900">{efficiency}%</span>
                                <div className={`p-2 rounded-lg ${efficiencyColor}`}>
                                    <TrendingUp className="w-5 h-5" />
                                </div>
                            </div>
                            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                <div 
                                    className={`h-full ${efficiencyBarColor} rounded-full transition-all duration-700`} 
                                    style={{ width: `${efficiency}%` }}
                                ></div>
                            </div>
                        </div>

                    </div>
                </section>
            </div>

            {/* RIGHT COLUMN: Upcoming */}
            <div className="lg:col-span-1 space-y-8">
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-bold text-slate-900 text-lg">Upcoming</h2>
                        <Link href="/dashboard/tasks" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 space-y-1">
                        {pendingTasks.slice(0, 4).map((task) => (
                            <div key={task.id} className="p-4 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group">
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${task.priority === 'High' ? 'bg-red-500' : 'bg-blue-500'}`}></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{task.title}</h4>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {task.deadline ? new Date(task.deadline).toLocaleDateString() : "No Date"}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {pendingTasks.length === 0 && (
                            <div className="p-8 text-center text-slate-400 text-sm italic">
                                No upcoming tasks.
                            </div>
                        )}
                    </div>
                </section>

                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 shadow-sm mb-4">
                        <FileText className="w-5 h-5" />
                    </div>
                    <h3 className="font-bold text-blue-900 mb-2">Company Docs</h3>
                    <p className="text-sm text-blue-700/80 mb-6 leading-relaxed">
                        Access templates and guidelines.
                    </p>
                    <Link href="/dashboard/documents" className="block w-full text-center bg-white text-blue-600 font-bold py-3 rounded-xl text-sm hover:shadow-md transition border border-blue-100">
                        Open Documents
                    </Link>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
}