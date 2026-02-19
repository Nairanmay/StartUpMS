"use client";
import { useEffect, useState, useRef } from "react";
import { getUser, getUsersByCompany, getProjectsWithTasks, getPitchDeckAnalysis } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Loader2, Users, FileText, DollarSign, ClipboardCheck, 
  Home, LogOut, Building2, PieChart, Files, Search, 
  Bell, ChevronRight, TrendingUp, Activity, X, User, Copy, Check
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]); 
  const [pitchScore, setPitchScore] = useState(null);
  
  // Interactive State
  const [searchQuery, setSearchQuery] = useState("");
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [copied, setCopied] = useState(false); 
  const notifRef = useRef(null);
  
  const router = useRouter();

  // Close notifications on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setIsNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    async function loadDashboardData() {
      try {
        const userRes = await getUser(token);
        if (userRes.data.role !== "admin") {
          router.push("/dashboard");
          return;
        }
        setUser(userRes.data);

        if (userRes.data.company_code) {
          const [usersData, projectsData, pitchData] = await Promise.all([
            getUsersByCompany(userRes.data.company_code).catch(() => []),
            getProjectsWithTasks().catch(() => []), 
            getPitchDeckAnalysis().catch(() => null) 
          ]);

          setEmployees(Array.isArray(usersData) ? usersData : []);
          
          let allTasks = [];
          if (Array.isArray(projectsData)) {
            projectsData.forEach(project => {
              if (Array.isArray(project.tasks)) {
                allTasks = [...allTasks, ...project.tasks];
              }
            });
          }
          setTasks(allTasks);

          if (pitchData && pitchData.ratings) {
            const ratings = Object.values(pitchData.ratings);
            if (ratings.length > 0) {
              const total = ratings.reduce((acc, curr) => acc + curr, 0);
              const avg = Math.round((total / ratings.length) * 10);
              setPitchScore(avg);
            }
          }
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  const handleCopyCode = () => {
    if (user?.company_code) {
      navigator.clipboard.writeText(user.company_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => (t.status || "").toLowerCase() === 'completed');
  const pendingTasks = tasks.filter(t => (t.status || "").toLowerCase() !== 'completed');
  
  const completedTasksCount = completedTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;
  
  const allActions = [
    { title: "Manage Users", desc: "Add employees & roles", icon: <Users />, href: "/admin/employee", color: "bg-blue-50 text-blue-600" },
    { title: "Pitch Deck AI", desc: "Analyze deck strength", icon: <FileText />, href: "/admin/pitch-deck", color: "bg-purple-50 text-purple-600" },
    { title: "Funding Advisor", desc: "Get investor matches", icon: <DollarSign />, href: "/admin/funding-suggestions", color: "bg-green-50 text-green-600" },
    { title: "Assign Tasks", desc: "Delegate work to team", icon: <ClipboardCheck />, href: "/admin/assign_task", color: "bg-orange-50 text-orange-600" },
    { title: "Cap Table", desc: "Manage equity & shares", icon: <PieChart />, href: "/admin/captable", color: "bg-pink-50 text-pink-600" },
    { title: "Documents", desc: "Company file storage", icon: <Files />, href: "/admin/documents", color: "bg-indigo-50 text-indigo-600" },
    { title: "Business Profile", desc: "Edit company details", icon: <Building2 />, href: "/admin/business_details", color: "bg-teal-50 text-teal-600" },
  ];

  const filteredActions = allActions.filter(a => 
    (a.title || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
    (a.desc || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredEmployees = employees.filter(e => 
    (e.username || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.email || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredTasks = tasks.filter(t => 
    (t.title || t.description || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading || !user) {
    return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;
  }

  return (
    // 1. ADDED 'relative' TO THIS WRAPPER
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 relative">
      
      {/* 2. ADDED BACKGROUND IMAGE DIV */}
      {/* Change 'YOUR_BG_IMAGE.png' to the file name in your public folder */}
      {/* Adjust opacity-[0.05] (5%) to make it lighter or darker */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.2] grayscale pointer-events-none bg-repeat" 
        style={{ backgroundImage: `url('/bg3.jpg')` }} 
      ></div>

      <Sidebar user={user} />
      
      {/* ADDED 'relative z-10' to ensure content stays above the background */}
      <main className="flex-1 ml-72 relative z-10">
        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-8 sticky top-0 z-30">
          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-900">Dashboard</span>
          </div>

          <div className="flex items-center gap-6">
            {/* SEARCH BAR */}
            <div className="relative z-40">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search actions, users, tasks..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-2.5 rounded-full bg-slate-50 border border-transparent focus:bg-white focus:border-blue-200 focus:ring-4 focus:ring-blue-50 outline-none text-sm w-72 transition-all" 
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* NOTIFICATION BELL */}
            <div className="relative" ref={notifRef}>
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-2.5 rounded-full transition-colors ${isNotifOpen ? "bg-blue-50 text-blue-600" : "hover:bg-slate-50 text-slate-500"}`}
              >
                <Bell className="w-5 h-5" />
                {pendingTasks.length > 0 && (
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isNotifOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-14 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                      <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                      <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{pendingTasks.length} Pending</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {pendingTasks.length === 0 ? (
                        <div className="p-8 text-center text-slate-500 text-sm">
                          <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                          No new notifications
                        </div>
                      ) : (
                        pendingTasks.map((task) => (
                          <div key={task.id} className="p-4 border-b border-slate-50 hover:bg-slate-50 transition cursor-pointer">
                            <div className="flex justify-between items-start mb-1">
                              <p className="text-sm font-semibold text-slate-900 line-clamp-1">{task.title || "Task Alert"}</p>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">Just now</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2">{task.description}</p>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-3 bg-slate-50 border-t border-slate-100 text-center">
                      <Link href="/admin/assign_task" className="text-xs font-bold text-blue-600 hover:text-blue-700">View All Tasks</Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold shadow-lg shadow-blue-200 cursor-default">
              {user.username[0].toUpperCase()}
            </div>
          </div>
        </header>

        <div className="p-8 md:p-10 max-w-7xl mx-auto relative z-10">
          {searchQuery ? (
             /* --- SEARCH RESULTS VIEW --- */
             <div className="space-y-8 animate-in fade-in duration-300">
               <div className="flex items-center gap-3 mb-6">
                 <Search className="w-6 h-6 text-slate-400" />
                 <h2 className="text-2xl font-bold text-slate-900">Search Results for "{searchQuery}"</h2>
               </div>

               {/* 1. Actions */}
               {filteredActions.length > 0 && (
                 <section>
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Quick Actions</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredActions.map((action, i) => (
                       <ActionCard key={i} {...action} />
                     ))}
                   </div>
                 </section>
               )}

               {/* 2. Employees */}
               {filteredEmployees.length > 0 && (
                 <section>
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Employees</h3>
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                     {filteredEmployees.map((emp) => (
                       <div key={emp.id} className="bg-white p-4 rounded-xl border border-slate-100 flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600"><User className="w-5 h-5" /></div>
                         <div>
                           <p className="font-bold text-slate-900">{emp.username}</p>
                           <p className="text-xs text-slate-500">{emp.email}</p>
                         </div>
                       </div>
                     ))}
                   </div>
                 </section>
               )}

               {/* 3. Tasks */}
               {filteredTasks.length > 0 && (
                 <section>
                   <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Tasks</h3>
                   <div className="grid grid-cols-1 gap-3">
                     {filteredTasks.map((t) => (
                       <div key={t.id} className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center">
                         <div>
                            <p className="font-bold text-slate-900">{t.title || "Untitled Task"}</p>
                            <p className="text-xs text-slate-500">{t.description}</p>
                         </div>
                         <span className={`px-2 py-1 rounded-lg text-xs font-bold ${(t.status || "").toLowerCase() === 'completed' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'}`}>
                           {t.status || 'Pending'}
                         </span>
                       </div>
                     ))}
                   </div>
                 </section>
               )}

               {filteredActions.length === 0 && filteredEmployees.length === 0 && filteredTasks.length === 0 && (
                 <div className="text-center py-20 text-slate-400">
                   <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
                   <p>No results found.</p>
                 </div>
               )}
             </div>
          ) : (
            /* --- DEFAULT DASHBOARD VIEW --- */
            <div className="space-y-10 animate-in slide-in-from-bottom-4 duration-500">
              
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
                <p className="text-slate-500 mt-2">
  Welcome back, <span className="font-bold text-lg text-slate-800">{user.username}</span>. Here is your company overview.
</p>
                </div>
                
                {user.company_code && (
                  <div className="bg-white pl-4 pr-2 py-2 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 relative">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Invite Code</span>
                      <span className="text-lg font-mono font-bold text-blue-600 leading-none tracking-widest">{user.company_code}</span>
                    </div>
                    <button 
                      onClick={handleCopyCode} 
                      className={`p-2 rounded-lg transition-all ${copied ? "bg-green-50 text-green-600" : "bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-blue-50"}`}
                      title="Copy to clipboard"
                    >
                      {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                    </button>
                    {copied && <span className="absolute -bottom-5 right-2 text-[10px] font-bold text-green-600 animate-in fade-in">Copied!</span>}
                  </div>
                )}
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Employees" value={employees.length} icon={<Users className="text-blue-600" />} trend="Active Users" color="blue" />
                <StatCard title="Pending Tasks" value={pendingTasks.length} icon={<ClipboardCheck className="text-orange-500" />} trend="In Progress" color="orange" />
                <StatCard 
                  title="Pitch Score" 
                  value={pitchScore !== null ? `${pitchScore}/100` : "No Data"} 
                  icon={<FileText className="text-purple-600" />} 
                  trend={pitchScore ? "AI Analysis" : "Upload Deck"} 
                  color="purple" 
                />
                
                <StatCard 
                  title="Completion Rate" 
                  value={`${completionRate}%`} 
                  icon={<TrendingUp className="text-green-600" />} 
                  trend={`${completedTasksCount} / ${totalTasks} Done`} 
                  color="green" 
                />
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Actions Grid */}
                <div className="xl:col-span-2 space-y-6">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-500" /> Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {allActions.map((action, i) => (
                      <ActionCard key={i} {...action} />
                    ))}
                  </div>
                </div>

                {/* Activity / Tips */}
                <div className="space-y-6">
                  <h2 className="text-lg font-bold text-slate-900">Recent Activity</h2>
                  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm min-h-[200px] flex flex-col items-center justify-center text-center">
                     <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                        <Activity className="w-5 h-5 text-slate-300" />
                     </div>
                     <p className="text-slate-500 text-sm">No recent activity logged.</p>
                  </div>
                  
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
                    <h3 className="font-bold text-lg mb-2">🚀 Pro Tip</h3>
                    <p className="text-blue-100 text-sm mb-4">Complete your business profile to get better funding matches.</p>
                    <Link href="/admin/business_details" className="text-xs font-bold bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition">
                      Edit Profile
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// --- Sub-Components ---
function StatCard({ title, value, icon, trend, color }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <p className="text-slate-500 text-sm font-medium">{title}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-50`}>{icon}</div>
      </div>
      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 w-fit px-2 py-1 rounded-full relative z-10">
        <TrendingUp className="w-3 h-3" /> {trend}
      </div>
    </div>
  );
}

function ActionCard({ title, desc, icon, href, color }) {
  return (
    <Link href={href} className="group">
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 h-full flex items-center gap-5 relative overflow-hidden">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${color} group-hover:scale-110 transition-transform relative z-10`}>
          {icon}
        </div>
        <div className="relative z-10">
          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h3>
          <p className="text-sm text-slate-500 mt-1">{desc}</p>
        </div>
        <ChevronRight className="ml-auto w-5 h-5 text-slate-300 group-hover:text-blue-500 transition-colors relative z-10" />
      </div>
    </Link>
  );
}

function Sidebar({ user }) {
  const router = useRouter();
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
           <img src="/logowb.png" alt="Logo" className="h-30 w-auto" />
        </div>
      </div>
      <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
        <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Main Menu</p>
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group cursor-pointer text-slate-500 hover:bg-slate-50 hover:text-slate-900`}>
              <span className={`transition-colors text-slate-400 group-hover:text-slate-600`}>{item.icon}</span>
              {item.label}
            </div>
          </Link>
        ))}
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