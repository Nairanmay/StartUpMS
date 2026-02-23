"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { 
  FileText, Files, Home, Upload, Search, Trash2, 
  Download, Image as ImageIcon, File, MoreVertical, 
  Loader2, X, ChevronRight, Users, ClipboardCheck, 
  DollarSign, PieChart, Building2, LogOut, FileCode,
  Database // Added Database icon for Storage
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { getUser } from "@/lib/api";

// --- Helper: File Icon based on extension ---
const getFileIcon = (filename) => {
  const ext = filename?.split('.').pop().toLowerCase();
  if (['pdf'].includes(ext)) return <FileText className="w-5 h-5 text-red-500" />;
  if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return <ImageIcon className="w-5 h-5 text-purple-500" />;
  if (['doc', 'docx'].includes(ext)) return <FileText className="w-5 h-5 text-blue-500" />;
  if (['xls', 'xlsx', 'csv'].includes(ext)) return <FileText className="w-5 h-5 text-green-500" />;
  return <File className="w-5 h-5 text-slate-400" />;
};

// --- Helper: Parse String Size to Bytes ---
const parseSizeToBytes = (size) => {
  if (!size) return 0;
  if (typeof size === 'number') return size;
  
  const str = String(size).trim().toUpperCase();
  const match = str.match(/([\d.]+)\s*(KB|MB|GB|B)?/);
  if (!match) return Number(str) || 0;
  
  const val = parseFloat(match[1]);
  const unit = match[2];
  
  if (unit === 'KB') return val * 1024;
  if (unit === 'MB') return val * 1024 * 1024;
  if (unit === 'GB') return val * 1024 * 1024 * 1024;
  return val;
};

// --- Helper: Format Bytes ---
const formatBytes = (bytes, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export default function DocumentHub() {
  const [user, setUser] = useState(null);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const router = useRouter();

  // Auth & Fetch
  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { router.push("/login"); return; }

    async function init() {
      try {
        const userRes = await getUser(token);
        if (userRes.data.role !== "admin") { router.push("/dashboard"); return; }
        setUser(userRes.data);
        await fetchDocuments(token);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    init();
  }, [router]);

  const fetchDocuments = async (token) => {
    try {
      const res = await fetch("https://backend-ug9v.onrender.com/api/documents/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDocuments(data);
      }
    } catch (err) {
      console.error("Failed to fetch docs", err);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this file?")) return;
    try {
      const token = localStorage.getItem("access");
      const res = await fetch(`https://backend-ug9v.onrender.com/api/documents/${id}/`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setDocuments(documents.filter(d => d.id !== id));
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  // Derived State (Search)
  const filteredDocs = documents.filter(doc => 
    doc.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.file?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- STATISTICS CALCULATIONS ---
  const totalFiles = documents.length;

  // Recent Uploads (Last 7 Days)
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const recentUploadsCount = documents.filter(doc => {
    // UPDATED: Added doc.uploaded_at
    const docDate = new Date(doc.uploaded_at || doc.created_at || doc.date || Date.now());
    return docDate >= sevenDaysAgo;
  }).length;

  // Storage Used
  const totalBytes = documents.reduce((acc, doc) => {
    return acc + parseSizeToBytes(doc.file_size || doc.size);
  }, 0);
  const storageUsed = formatBytes(totalBytes);

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
              <span className="font-medium text-slate-900">Documents</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900">Document Hub</h1>
            <p className="text-slate-500 mt-1">Securely store, organize, and share your startup's files.</p>
          </div>
          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 px-5 py-3 rounded-xl font-bold transition shadow-lg shadow-blue-200"
          >
            <Upload className="w-4 h-4" /> Upload File
          </button>
        </header>

        {/* --- DYNAMIC STATS ROW --- */}
        <div className="grid sm:grid-cols-3 gap-6 mb-8">
          <StatCard 
            title="Total Files" 
            value={totalFiles} 
            icon={<Files className="text-blue-600" />} 
            color="blue" 
          />
          <StatCard 
            title="Recent Uploads" 
            value={`${recentUploadsCount} this week`} 
            icon={<FileCode className="text-purple-600" />} 
            color="purple" 
          />
          <StatCard 
            title="Storage Used" 
            value={storageUsed} 
            icon={<Database className="text-green-600" />} 
            color="green" 
          />
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm mb-6 flex items-center gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search documents..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg focus:ring-2 focus:ring-blue-100 outline-none text-sm transition-all"
            />
          </div>
        </div>

        {/* Documents Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Size</th>
                <th className="px-6 py-4">Date Added</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                      <Files className="w-12 h-12 mb-3 opacity-20" />
                      <p>No documents found.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition">
                          {getFileIcon(doc.file || "")}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{doc.title || "Untitled"}</p>
                          <p className="text-xs text-slate-400 truncate max-w-[200px]">{doc.file?.split('/').pop()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 uppercase font-bold text-[10px] tracking-wide">
                      {doc.file?.split('.').pop()}
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {doc.file_size || doc.size ? formatBytes(parseSizeToBytes(doc.file_size || doc.size)) : "Unknown"}
                    </td>
                   <td className="px-6 py-4 text-sm text-slate-500">
                     {/* UPDATED: Added doc.uploaded_at */}
                     {new Date(doc.uploaded_at || doc.created_at || doc.date || Date.now()).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <a 
                          href={doc.file} 
                          target="_blank" 
                          download
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                          title="Download"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDelete(doc.id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Upload Modal */}
        <UploadModal 
          isOpen={isUploadModalOpen} 
          onClose={() => setIsUploadModalOpen(false)} 
          onSuccess={() => {
            fetchDocuments(localStorage.getItem("access"));
            setIsUploadModalOpen(false);
          }} 
        />
      </main>
    </div>
  );
}

// --- Sub-Components ---

function StatCard({ title, value, icon, color }) {
  // Dynamically mapped background colors for safe tailwind rendering
  const bgColors = {
    blue: "bg-blue-50",
    purple: "bg-purple-50",
    green: "bg-green-50",
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-slate-900 mt-1">{value}</p>
      </div>
      <div className={`p-3 ${bgColors[color] || 'bg-slate-50'} rounded-xl`}>{icon}</div>
    </div>
  );
}

function UploadModal({ isOpen, onClose, onSuccess }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [uploading, setUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title || file.name);

    try {
      const token = localStorage.getItem("access");
      const res = await fetch("https://backend-ug9v.onrender.com/api/documents/", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        onSuccess();
        setFile(null);
        setTitle("");
      } else {
        alert("Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Error uploading");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex justify-center items-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md relative animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Upload Document</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Document Title</label>
            <input 
              type="text" 
              placeholder="e.g. Q3 Financial Report" 
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <label className="block w-full border-2 border-dashed border-slate-200 rounded-xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all text-center group">
            <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-700">{file ? file.name : "Click to upload file"}</p>
            <p className="text-xs text-slate-400 mt-1">PDF, DOCX, XLSX, PNG, JPG</p>
          </label>

          <button 
            type="submit" 
            disabled={uploading || !file}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {uploading ? <Loader2 className="animate-spin w-5 h-5" /> : "Upload Now"}
          </button>
        </form>
      </div>
    </div>
  );
}

// --- Reused Sidebar ---
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
           <img src="/logowb.png" alt="Logo" className="h-30 w-auto" />
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