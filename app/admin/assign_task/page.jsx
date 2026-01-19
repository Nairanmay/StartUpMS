"use client";

import { useEffect, useMemo, useState } from "react";
import { 
  createProject, createTask, getUsersByCompany, getUser 
} from "@/lib/api"; // Updated import path to match your project structure
import { 
  LayoutDashboard, Plus, Trash2, Calendar, FileText, 
  Users, User, Upload, CheckCircle, Info, Loader2, 
  ChevronRight, Home, DollarSign, PieChart, Files, 
  Building2, LogOut, ClipboardCheck
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

// --- Reusable Sidebar (Consistent with other pages) ---
function Sidebar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  
  // Safe logout handler
  const handleLogout = () => {
    localStorage.removeItem("access");
    router.push("/login");
  };

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
    <aside className="fixed top-0 left-0 h-screen w-72 bg-white border-r border-slate-100 z-50 flex-col hidden lg:flex">
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
          <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs">{user?.username?.[0]?.toUpperCase() || "A"}</div>
          <div className="overflow-hidden">
            <p className="text-sm font-bold text-slate-900 truncate">{user?.username || "Admin"}</p>
            <p className="text-xs text-slate-500 truncate">Administrator</p>
          </div>
        </div>
        <button onClick={handleLogout} className="flex items-center justify-center gap-2 w-full text-red-600 bg-white border border-red-100 hover:bg-red-50 font-medium px-4 py-2.5 rounded-xl transition-colors text-sm">
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>
    </aside>
  );
}

export default function TaskAssignPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  
  // Form State
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("individual");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([
    { description: "", assignedTo: [], requires_document: false, document: null },
  ]);
  const [adminFile, setAdminFile] = useState(null);
  
  // UI State
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const router = useRouter();

  // Fetch employees & user
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          router.push("/login");
          return;
        }
        
        const userRes = await getUser(token);
        if (mounted) setUser(userRes.data);

        const companyCode = userRes.data?.company_code;
        if (!companyCode) {
          setError("Company code not found in user profile");
          return;
        }

        const employeesList = await getUsersByCompany(companyCode);
        if (mounted) setEmployees(employeesList || []);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load employees");
      }
    })();
    return () => { mounted = false; };
  }, [router]);

  const typeHint = useMemo(
    () =>
      projectType === "individual"
        ? "Assign each task to exactly 1 person."
        : "Tasks can be shared by multiple people.",
    [projectType]
  );

  const handleTaskChange = (index, field, value) => {
    const copy = [...tasks];
    copy[index][field] = value;
    setTasks(copy);
  };

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      { description: "", assignedTo: [], requires_document: false, document: null },
    ]);
  };

  const removeTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!projectName.trim()) return "Project name is required.";
    if (!deadline) return "Deadline is required.";
    if (tasks.length === 0) return "Add at least one task.";
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (!t.description.trim()) return `Task #${i + 1} needs a description.`;
      if (projectType === "individual" && t.assignedTo.length !== 1)
        return `Task #${i + 1} must have exactly one assignee for an individual project.`;
      if (projectType === "group" && t.assignedTo.length === 0)
        return `Task #${i + 1} must have at least one assignee for a group project.`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    const msg = validateForm();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setLoading(true);

      // Create project
      const formData = new FormData();
      formData.append("name", projectName.trim());
      formData.append("type", projectType);
      formData.append("deadline", deadline);
      if (adminFile) formData.append("file", adminFile);

      const project = await createProject(formData, true);

      // Create tasks
      for (const t of tasks) {
        const taskData = new FormData();
        taskData.append("project_id", project.id);
        taskData.append("description", t.description.trim());
        taskData.append("requires_document", String(t.requires_document));

        t.assignedTo.forEach((id) => taskData.append("assigned_to_ids", id));
        if (t.document) taskData.append("document", t.document);

        await createTask(taskData, true);
      }

      // Reset form
      setProjectName("");
      setProjectType("individual");
      setDeadline("");
      setTasks([{ description: "", assignedTo: [], requires_document: false, document: null }]);
      setAdminFile(null);
      setSuccess("Project and tasks created successfully! ✨");
      
      // Auto clear success message
      setTimeout(() => setSuccess(""), 3000);

    } catch (err) {
      console.error(err);
      setError("Error creating project or tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <Sidebar user={user} />

      <main className="flex-1 lg:ml-72 p-8 md:p-12 transition-all">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-2 text-slate-500 text-sm mb-2">
            <Home className="w-4 h-4" />
            <ChevronRight className="w-4 h-4" />
            <span>Admin</span>
            <ChevronRight className="w-4 h-4" />
            <span className="font-medium text-slate-900">Assign Tasks</span>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">Create New Project</h1>
          <p className="text-slate-500 mt-1">Set up a project and assign tasks to your team members.</p>
        </header>

        {/* Notifications */}
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm font-medium flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid xl:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Project Details */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm sticky top-8">
              <div className="flex items-center gap-3 mb-6 border-b border-slate-50 pb-4">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><LayoutDashboard className="w-5 h-5" /></div>
                <h3 className="font-bold text-slate-900">Project Details</h3>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Project Name</label>
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="e.g. Q3 Marketing Campaign"
                    className="input-field"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Type</label>
                    <select
                      value={projectType}
                      onChange={(e) => setProjectType(e.target.value)}
                      className="input-field"
                    >
                      <option value="individual">Individual</option>
                      <option value="group">Group</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Deadline</label>
                    <input
                      type="date"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="input-field"
                      required
                    />
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-xl flex gap-2 text-blue-700 text-xs font-medium">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  {typeHint}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Reference File (Optional)</label>
                  <label className="block w-full border border-dashed border-slate-300 rounded-xl p-4 cursor-pointer hover:border-blue-500 hover:bg-slate-50 transition text-center">
                    <input type="file" onChange={(e) => setAdminFile(e.target.files[0])} className="hidden" />
                    <div className="flex items-center justify-center gap-2 text-slate-600 text-sm font-medium">
                      <Upload className="w-4 h-4" />
                      {adminFile ? adminFile.name : "Upload Admin File"}
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Tasks */}
          <div className="xl:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Task Builder</h2>
              <button
                type="button"
                onClick={addTask}
                className="flex items-center gap-2 bg-white text-slate-700 hover:text-blue-600 border border-slate-200 hover:border-blue-300 px-4 py-2 rounded-xl font-bold transition shadow-sm text-sm"
              >
                <Plus className="w-4 h-4" /> Add Task
              </button>
            </div>

            <div className="space-y-4">
              {tasks.map((task, index) => (
                <div key={index} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm relative group animate-in slide-in-from-bottom-2 fade-in duration-300">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-2">
                      <span className="bg-slate-100 text-slate-500 text-xs font-bold px-2 py-1 rounded-md">Task #{index + 1}</span>
                    </div>
                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="text-slate-300 hover:text-red-500 transition p-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                        <textarea
                          rows="3"
                          value={task.description}
                          onChange={(e) => handleTaskChange(index, "description", e.target.value)}
                          placeholder="What needs to be done?"
                          className="input-field resize-none"
                          required
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`req-doc-${index}`}
                          checked={task.requires_document}
                          onChange={(e) => handleTaskChange(index, "requires_document", e.target.checked)}
                          className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                        />
                        <label htmlFor={`req-doc-${index}`} className="text-sm text-slate-600 cursor-pointer select-none">
                          Require employee to upload a file
                        </label>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign To</label>
                        <select
                          multiple={projectType === "group"}
                          value={projectType === "group" ? task.assignedTo : task.assignedTo[0] || ""}
                          onChange={(e) => handleTaskChange(index, "assignedTo", 
                            projectType === "group" 
                              ? Array.from(e.target.selectedOptions, (opt) => opt.value)
                              : [e.target.value]
                          )}
                          className={`input-field ${projectType === 'group' ? 'h-32' : ''}`}
                        >
                          <option value="" disabled>Select Employee...</option>
                          {employees.map((emp) => (
                            <option key={emp.id} value={String(emp.id)}>
                              {emp.username} {emp.email ? `(${emp.email})` : ""}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-400 mt-1">
                          {projectType === 'group' ? 'Hold Ctrl/Cmd to select multiple' : 'Select one employee'}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Task Attachment</label>
                        <input
                          type="file"
                          onChange={(e) => handleTaskChange(index, "document", e.target.files[0])}
                          className="block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-200">
              <button
                type="submit"
                disabled={loading}
                className="w-full md:w-auto bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-8 rounded-xl transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed ml-auto"
              >
                {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <><CheckCircle className="w-5 h-5" /> Publish Project</>}
              </button>
            </div>
          </div>

        </form>
      </main>

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
          color: #0f172a;
        }
        .input-field:focus {
          background-color: #ffffff;
          border-color: #3b82f6;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
        }
        /* Custom scrollbar for multi-select */
        select[multiple] {
          padding-right: 0.5rem;
        }
      `}</style>
    </div>
  );
}