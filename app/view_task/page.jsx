"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  getProjectsWithTasks, 
  removeProject, 
  uploadTaskDocument, 
  getUser 
} from "@/lib/api";
import { 
  Home, CheckSquare, FileText, Building2, LayoutDashboard, 
  LogOut, ChevronDown, ChevronUp, Calendar, Trash2, 
  Upload, CheckCircle, Loader2, AlertCircle, Folder, Check, User, XCircle
} from "lucide-react";
import Link from "next/link";

// --- Sidebar ---
function UserSidebar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => { localStorage.removeItem("access"); router.push("/login"); };

  const navItems = [
    { href: "/dashboard", label: "My Dashboard", icon: <Home className="w-5 h-5" /> },
    { href: "/view_task", label: "My Tasks", icon: <CheckSquare className="w-5 h-5" /> }, 
    { href: "/dashboard/documents", label: "Documents", icon: <FileText className="w-5 h-5" /> },
    { href: "/admin/business_details", label: "Company Info", icon: <Building2 className="w-5 h-5" /> },
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
  const router = useRouter();

  // 1. Fetch Data
  const fetchData = async () => {
    try {
      const data = await getProjectsWithTasks();
      setProjects(data || []);
      // Auto expand first
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

  // 2. Mark Done Handler (Robust)
  const handleMarkDone = async (taskId, projectId) => {
    const token = localStorage.getItem("access");
    const originalProjects = JSON.parse(JSON.stringify(projects)); // Backup

    // Optimistic Update
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
        // Revert UI if failed
        setProjects(originalProjects);
        if (res.status === 404) {
            alert("Error: You do not have permission to edit this task (or it was deleted).");
        } else {
            alert(`Update failed: ${res.statusText}`);
        }
      } else {
        // Success: Trigger reload to ensure sync
        // We don't need to refetch immediately if optimistic update worked, 
        // but it helps ensure consistency.
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

  if (loading || !user) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <UserSidebar user={user} />
      <main className="flex-1 lg:ml-72 p-8 md:p-12 transition-all">
        <header className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">Projects & Assignments</h1>
          <p className="text-slate-500 mt-1">Manage your active projects and deliverables.</p>
        </header>

        {projects.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm text-center">
            <Folder className="w-10 h-10 text-slate-300 mb-4" />
            <h3 className="text-xl font-bold text-slate-900">No Projects Found</h3>
          </div>
        )}

        <div className="space-y-6">
          {projects.map((project) => {
            const totalTasks = project.tasks.length;
            const completedTasks = project.tasks.filter((t) => (t.status || "").toLowerCase() === "completed").length;
            const isCompleted = totalTasks > 0 && completedTasks === totalTasks;

            return (
              <div key={project.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                <div onClick={() => toggleExpand(project.id)} className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-slate-50/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={`p-2 rounded-lg ${isCompleted ? 'bg-green-100 text-green-600' : 'bg-blue-50 text-blue-600'}`}>
                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <Folder className="w-5 h-5" />}
                      </div>
                      <h2 className="text-xl font-bold text-slate-900">{project.name}</h2>
                      {isCompleted && <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 uppercase">Completed</span>}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-500 pl-1">
                      <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Due: {project.deadline || "N/A"}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                      <span>{completedTasks} / {totalTasks} done</span>
                    </div>
                  </div>
                  <div className={`p-2 rounded-full bg-slate-50 transition-transform ${expanded[project.id] ? 'rotate-180' : ''}`}>
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  </div>
                </div>

                {expanded[project.id] && (
                  <div className="border-t border-slate-100 bg-slate-50/50 p-6 space-y-3">
                    {project.tasks.map((task) => {
                      // CHECK PERMISSION: Is this task assigned to me?
                      const isAssignedToMe = String(task.assigned_to) === String(user.id) || 
                                             (Array.isArray(task.assigned_to_ids) && task.assigned_to_ids.map(String).includes(String(user.id)));
                      
                      return (
                        <div key={task.id} className={`bg-white p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-4 ${isAssignedToMe ? 'border-slate-100' : 'border-slate-100 opacity-60 bg-slate-50'}`}>
                          <div className="flex-1">
                            <div className="flex items-start gap-2">
                                {!isAssignedToMe && <User className="w-4 h-4 text-slate-400 mt-1" />}
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
                            {/* Actions only if assigned to me */}
                            {isAssignedToMe ? (
                                <>
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
                                </>
                            ) : (
                                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-1">
                                    <XCircle className="w-3 h-3" /> Not Assigned to You
                                </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
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