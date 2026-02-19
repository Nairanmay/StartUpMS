"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  getProjectsWithTasks, 
  getUser, 
  uploadTaskDocument 
} from "@/lib/api";
import { 
  Home, CheckSquare, FileText, Building2, LayoutDashboard, 
  LogOut, ChevronDown, Calendar, Upload, CheckCircle, 
  Loader2, Folder, Check, User, Filter
} from "lucide-react";
import Link from "next/link";

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
  const pathname = usePathname();
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
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">{user?.username?.[0]?.toUpperCase() || "U"}</div>
          <div className="overflow-hidden"><p className="text-sm font-bold text-slate-900 truncate">{user?.username}</p><p className="text-xs text-blue-600 font-medium">Employee</p></div>
        </div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${pathname === item.href ? "bg-slate-900 text-white shadow-lg" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"}`}>
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

// --- Main Page ---
export default function MyTasksPage() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [uploading, setUploading] = useState({});
  const [loading, setLoading] = useState(true);
  
  // NEW: Filter State ('all' | 'pending' | 'completed')
  const [filter, setFilter] = useState("all"); 

  const router = useRouter();

  // 1. Fetch Data
  const fetchData = async () => {
    try {
      const data = await getProjectsWithTasks();
      setProjects(data || []);
      if(data && data.length > 0 && Object.keys(expanded).length === 0) {
         setExpanded({ [data[0].id]: true });
      }
    } catch (error) { console.error(error); }
  };

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { router.push("/login"); return; }
    
    async function init() {
      try {
        const userRes = await getUser(token);
        setUser(userRes.data);
        await fetchData();
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    }
    init();
  }, [router]);

  const toggleExpand = (projectId) => {
    setExpanded((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  // 2. Mark Done Handler
  const handleMarkDone = async (taskId, projectId) => {
    const token = localStorage.getItem("access");
    const originalProjects = JSON.parse(JSON.stringify(projects));

    setProjects((prev) => prev.map((p) => {
      if (p.id === projectId) {
        return { ...p, tasks: p.tasks.map(t => t.id === taskId ? { ...t, status: "Completed" } : t) };
      }
      return p;
    }));

    try {
      const res = await fetch(`https://backend-ug9v.onrender.com/api/tasks/${taskId}/`, {
          method: "PATCH",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ status: "Completed" })
      });

      if (!res.ok) {
        setProjects(originalProjects);
        alert(`Update failed: ${res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      setProjects(originalProjects);
      alert("Network error.");
    }
  };

  const handleFileUpload = async (taskId, file) => {
    if (!file) return;
    setUploading((prev) => ({ ...prev, [taskId]: true }));
    await uploadTaskDocument(taskId, file);
    setUploading((prev) => ({ ...prev, [taskId]: false }));
    fetchData(); 
  };

  // --- Filter Logic ---
  // Helper to check if a task matches the current filter
  const matchesFilter = (task) => {
    const status = (task.status || "").toLowerCase();
    if (filter === "completed") return status === "completed";
    if (filter === "pending") return status !== "completed";
    return true; // 'all'
  };

  // Check if there are ANY tasks visible after filtering across all projects
  const hasVisibleTasks = projects.some(p => 
    p.tasks.some(t => checkIsAssigned(t, user) && matchesFilter(t))
  );

  if (loading || !user) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <UserSidebar user={user} />
      <main className="flex-1 lg:ml-72 p-8 md:p-12 transition-all">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Projects & Assignments</h1>
          <p className="text-slate-500 mt-1">Manage your active projects and deliverables.</p>
        </header>

        {/* --- NEW: Filter Tabs --- */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit mb-8">
          {["all", "pending", "completed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold capitalize transition-all ${
                filter === f 
                  ? "bg-white text-slate-900 shadow-sm" 
                  : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {!hasVisibleTasks && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
            <Folder className="w-10 h-10 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No {filter === 'all' ? '' : filter} Tasks Found</h3>
            <p className="text-slate-400 text-sm mt-1">
              {filter === 'completed' 
                ? "You haven't completed any tasks yet." 
                : "You're all caught up! No pending tasks."}
            </p>
          </div>
        )}

        <div className="space-y-6">
          {projects.map((project) => {
            // 1. First, get tasks assigned to ME
            const myTasks = project.tasks.filter(task => checkIsAssigned(task, user));
            
            // 2. Then, apply the STATUS filter
            const visibleTasks = myTasks.filter(matchesFilter);

            // 3. If no tasks match the filter, HIDE the project
            if (visibleTasks.length === 0) return null;

            // Stats based on MY tasks (Total vs Completed)
            const totalMyTasks = myTasks.length; 
            const completedMyTasks = myTasks.filter((t) => (t.status || "").toLowerCase() === "completed").length;
            const isProjectFullyComplete = totalMyTasks > 0 && completedMyTasks === totalMyTasks;

            return (
              <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div onClick={() => toggleExpand(project.id)} className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isProjectFullyComplete ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {isProjectFullyComplete ? <CheckCircle className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
                      {isProjectFullyComplete && <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 uppercase">Completed</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 pl-1">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Due: {project.deadline || "N/A"}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>{completedMyTasks} / {totalMyTasks} of your tasks done</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full bg-slate-50 transition-transform ${expanded[project.id] ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {expanded[project.id] && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-3">
                    {/* Render ONLY filtered visible tasks */}
                    {visibleTasks.map((task) => (
                      <div key={task.id} className="bg-white p-5 rounded-xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-in fade-in slide-in-from-top-1">
                        <div className="flex-1">
                          <div className="flex items-start gap-2">
                              <div>
                                  <p className="font-medium text-slate-900 text-base mb-1">{task.description}</p>
                                  <div className="flex flex-wrap gap-2 text-xs font-bold uppercase tracking-wide">
                                      {task.requires_document && (
                                      <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border ${task.document ? "bg-green-50 text-green-700 border-green-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}>
                                          {task.document ? "Doc Uploaded" : "Doc Required"}
                                      </span>
                                      )}
                                      <span className={`px-2.5 py-1 rounded-md border ${(task.status || "").toLowerCase() === 'completed' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                          {task.status || 'Pending'}
                                      </span>
                                  </div>
                              </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {task.requires_document && !task.document && (
                              <label className={`cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold transition ${uploading[task.id] ? "bg-slate-100 text-slate-400" : "border-slate-200 hover:border-blue-500 hover:text-blue-600 bg-white"}`}>
                              {uploading[task.id] ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                              <span>{uploading[task.id] ? "Uploading" : "Upload"}</span>
                              <input type="file" className="hidden" disabled={uploading[task.id]} onChange={(e) => handleFileUpload(task.id, e.target.files[0])} />
                              </label>
                          )}

                          {(task.status || "").toLowerCase() !== "completed" ? (
                              <button
                              onClick={() => handleMarkDone(task.id, project.id)}
                              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 text-sm font-bold transition shadow-lg"
                              >
                              <Check className="w-4 h-4" /> Mark Done
                              </button>
                          ) : (
                              <button disabled className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-green-100 text-green-700 text-sm font-bold cursor-not-allowed">
                              <CheckCircle className="w-4 h-4" /> Done
                              </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}