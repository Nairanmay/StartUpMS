"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { 
  Home, CheckSquare, FileText, Building2, LayoutDashboard, 
  LogOut, Bell, Flame, Calendar, ArrowRight, Loader2, 
  TrendingUp, CheckCircle, Clock, RefreshCw, AlertCircle, X
} from "lucide-react";
import Link from "next/link";
import { getUser, getProjectsWithTasks } from "@/lib/api";

// --- Helper: Check Assignment ---
const checkIsAssigned = (task, user) => {
  if (!user || !task) return false;
  const userIdStr = String(user.id);

  // 1. Check assigned_to_ids (Standard Array of IDs)
  if (Array.isArray(task.assigned_to_ids) && task.assigned_to_ids.map(String).includes(userIdStr)) {
    return true;
  } 
  // 2. Check assigned_to (Could be ID, Object, or Array)
  if (task.assigned_to) {
    if (Array.isArray(task.assigned_to)) {
       return task.assigned_to.some(val => String(val) === userIdStr || String(val?.id) === userIdStr);
    } else {
       return String(task.assigned_to) === userIdStr || String(task.assigned_to?.id) === userIdStr;
    }
  }
  return false;
};

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
           <img src="/logowb.png" alt="Logo" className="h-30 w-auto" />
           {/* <span className="font-bold text-lg text-slate-900 tracking-tight">Startify</span> */}
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
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${typeof window !== 'undefined' && window.location.pathname === item.href ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
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
  
  // New State for Notifications
  const [showNotifications, setShowNotifications] = useState(false);

  const router = useRouter();

  // 1. Fetch Data Function
  const loadData = async () => {
    const token = localStorage.getItem("access");
    if (!token) { router.push("/login"); return; }
    
    setRefreshing(true);
    try {
        // Fetch User
        const userRes = await getUser(token);
        const currentUser = userRes.data;
        setUser(currentUser);
        
        if (currentUser.role === 'admin') { 
            router.push('/admin/dashboard'); 
            return; 
        }

        // Fetch Projects (contains all tasks)
        const projectsData = await getProjectsWithTasks();
        
        // FLATTEN & FILTER: Extract only tasks assigned to THIS user
        let myAllTasks = [];
        if (projectsData && Array.isArray(projectsData)) {
            projectsData.forEach(project => {
                if (project.tasks && Array.isArray(project.tasks)) {
                    const assignedTasks = project.tasks.filter(task => checkIsAssigned(task, currentUser));
                    
                    // Add project info to task for display
                    const tasksWithMeta = assignedTasks.map(t => ({
                        ...t, 
                        projectName: project.name,
                        projectDeadline: project.deadline
                    }));
                    
                    myAllTasks = [...myAllTasks, ...tasksWithMeta];
                }
            });
        }
        
        setTasks(myAllTasks);

    } catch (err) { 
        console.error("Dashboard Load Error:", err);
        if (err.response && err.response.status === 401) {
            localStorage.removeItem("access"); 
            router.push("/login"); 
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
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: "Completed" } : t));

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
  const sortedPending = [...pendingTasks].sort((a, b) => {
     if(a.priority === 'High' && b.priority !== 'High') return -1;
     return 0; 
  });
  const focusTask = sortedPending.length > 0 ? sortedPending[0] : null;

  // --- NOTIFICATIONS LOGIC ---
  const notifications = useMemo(() => {
    const list = [];
    const today = new Date();

    pendingTasks.forEach(t => {
        // Check 1: High Priority
        if (t.priority === 'High') {
            list.push({ id: t.id, title: "High Priority Task", msg: `"${t.description}" needs attention.`, type: 'alert' });
        }
        // Check 2: Approaching Deadline (within 3 days)
        if (t.projectDeadline) {
            const due = new Date(t.projectDeadline);
            const diffTime = due - today;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays >= 0 && diffDays <= 3) {
                list.push({ id: t.id, title: "Deadline Approaching", msg: `"${t.description}" is due in ${diffDays} day(s).`, type: 'time' });
            }
        }
    });
    // Remove duplicates if any (simple logic) & Limit to 5
    return list.slice(0, 5);
  }, [pendingTasks]);

  if (loading || !user) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <UserSidebar user={user} />
      
      <main className="flex-1 lg:ml-72 p-8 md:p-12 transition-all">
        {/* Header */}
        <header className="mb-12 flex justify-between items-center relative">
            <div>
                <h1 className="text-3xl font-bold text-slate-900">{getGreeting()}, {user.username} ☀️</h1>
                <p className="text-slate-500 mt-1">Here is your daily performance summary.</p>
            </div>
            
            <div className="flex items-center gap-4">
                {/* Refresh Button */}
                <button 
                    onClick={loadData}
                    disabled={refreshing}
                    className="p-2.5 rounded-full bg-white border border-slate-100 shadow-sm text-slate-400 hover:text-blue-600 transition"
                    title="Refresh Data"
                >
                    <RefreshCw className={`w-5 h-5 ${refreshing ? "animate-spin text-blue-600" : ""}`} />
                </button>

                {/* Notifications Bell */}
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`p-2.5 rounded-full border shadow-sm transition relative ${showNotifications ? "bg-blue-50 border-blue-200 text-blue-600" : "bg-white border-slate-100 text-slate-400 hover:text-slate-600"}`}
                    >
                        <Bell className="w-5 h-5" />
                        {notifications.length > 0 && (
                            <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                        )}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                            <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                                <h4 className="font-bold text-slate-900 text-sm">Notifications</h4>
                                <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X className="w-4 h-4" /></button>
                            </div>
                            <div className="max-h-[300px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((note, i) => (
                                        <div key={i} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition flex gap-3">
                                            <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${note.type === 'alert' ? 'bg-red-500' : 'bg-orange-500'}`}></div>
                                            <div>
                                                <p className={`text-xs font-bold uppercase mb-0.5 ${note.type === 'alert' ? 'text-red-500' : 'text-orange-500'}`}>{note.title}</p>
                                                <p className="text-sm text-slate-600 leading-snug">{note.msg}</p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-slate-400">
                                        <CheckCircle className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                                        <p className="text-xs">No new notifications</p>
                                    </div>
                                )}
                            </div>
                            <div className="p-3 bg-slate-50 text-center border-t border-slate-100">
                                <Link href="/view_task" className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Tasks</Link>
                            </div>
                        </div>
                    )}
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
                                        {focusTask.projectName || 'Active Project'}
                                    </span>
                                    <span className="text-slate-400 text-xs font-bold tracking-wider uppercase flex items-center gap-2">
                                        <Clock className="w-3 h-3" /> Due {focusTask.projectDeadline || 'Soon'}
                                    </span>
                                </div>
                                <h3 className="text-2xl font-bold mb-3 leading-snug">{focusTask.description}</h3>
                                <p className="text-slate-400 text-sm mb-8 line-clamp-2 max-w-lg">
                                    {focusTask.requires_document ? "Requires document upload." : "Standard task."}
                                </p>
                                <div className="flex gap-4">
                                    {/* Action 1: Mark Complete directly */}
                                    <button 
                                        onClick={() => handleQuickComplete(focusTask.id)}
                                        className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-green-50 hover:text-green-700 transition flex items-center gap-2 shadow-lg shadow-white/10"
                                    >
                                        <CheckCircle className="w-4 h-4" /> Mark Done
                                    </button>
                                    
                                    {/* Action 2: View Details */}
                                    <Link href="/view_task" className="text-slate-300 px-4 py-3 rounded-xl font-bold text-sm border border-slate-700 hover:bg-slate-800 transition">
                                        View All Tasks
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
                        <Link href="/view_task" className="text-xs font-bold text-blue-600 hover:underline">View All</Link>
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-3 space-y-1">
                        {pendingTasks.slice(0, 4).map((task) => (
                            <div key={task.id} className="p-4 rounded-xl hover:bg-slate-50 transition flex items-start gap-3 group">
                                <div className={`w-2 h-2 rounded-full mt-2 shrink-0 bg-blue-500`}></div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{task.description}</h4>
                                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {task.projectDeadline || "No Date"}
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