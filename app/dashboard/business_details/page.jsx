"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getCompanyProfile, getUser } from "@/lib/api";
import { 
  Building2, Globe, Mail, Phone, MapPin, Calendar, Loader2,
  Home, CheckSquare, FileText, LogOut, LayoutDashboard 
} from "lucide-react";

// --- Sidebar Component ---
function UserSidebar({ user }) {
  const router = useRouter();
  const pathname = usePathname();
  const handleLogout = () => { localStorage.removeItem("access"); router.push("/login"); };

  const navItems = [
    { href: "/dashboard", label: "My Dashboard", icon: <Home className="w-5 h-5" /> },
    { href: "/view_task", label: "My Tasks", icon: <CheckSquare className="w-5 h-5" /> }, 
    { href: "/dashboard/documents", label: "Documents", icon: <FileText className="w-5 h-5" /> },
    { href: "/dashboard/business_details", label: "Company Info", icon: <Building2 className="w-5 h-5" /> },
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

// --- Main Page Component ---
export default function UserBusinessDetails() {
  const [data, setData] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) { router.push("/login"); return; }
    
    getUser(token).then(res => {
      setUser(res.data);
      getCompanyProfile().then((profileRes) => {
        setData(profileRes);
        setLoading(false);
      }).catch(() => setLoading(false));
    }).catch(() => router.push("/login"));
  }, [router]);

  if (loading) return <div className="flex h-screen items-center justify-center bg-slate-50"><Loader2 className="animate-spin text-blue-600 w-10 h-10" /></div>;

  if (!data || !data.name) return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <UserSidebar user={user} />
      <main className="flex-1 lg:ml-72 p-8 flex items-center justify-center text-slate-500">
        <p>No business details available yet.</p>
      </main>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900">
      <UserSidebar user={user} />
      
      <main className="flex-1 lg:ml-72 p-8 md:p-12 transition-all flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-fit">
          {/* Banner / Header */}
          <div className="bg-slate-900 p-10 text-white relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="p-5 bg-white/10 backdrop-blur-md rounded-2xl border border-white/10">
                <Building2 className="w-10 h-10 text-blue-400" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
                <p className="text-slate-400 text-sm mt-1 uppercase tracking-wider font-bold">{data.industry}</p>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-blue-600 rounded-full blur-3xl opacity-20"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
            {/* Sidebar Info */}
            <div className="lg:col-span-1 bg-slate-50/50 p-8 border-r border-slate-100 space-y-6">
              <h3 className="text-slate-900 font-bold text-lg mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-slate-400" /> Overview
              </h3>
              
              <InfoItem icon={<Globe />} label="Website" value={data.website} isLink />
              <InfoItem icon={<Mail />} label="Email" value={data.email} isLink prefix="mailto:" />
              <InfoItem icon={<Phone />} label="Phone" value={data.phone} />
              <InfoItem icon={<MapPin />} label="Location" value={data.location} />
              {data.founded_date && <InfoItem icon={<Calendar />} label="Founded" value={data.founded_date} />}
            </div>

            {/* Main Description */}
            <div className="lg:col-span-2 p-10">
              <h2 className="text-xl font-bold text-slate-900 mb-6">About the Company</h2>
              <div className="prose prose-slate text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {data.description || "No description provided by the administrator."}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// Info Item UI Helper
function InfoItem({ icon, label, value, isLink, prefix = "" }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-100 transition-all">
      <div className="text-blue-600 mt-0.5 opacity-70">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
        {isLink ? (
          <a href={`${prefix}${value}`} target="_blank" rel="noreferrer" className="text-slate-800 text-sm font-medium hover:text-blue-600 transition truncate block">
            {value}
          </a>
        ) : (
          <p className="text-slate-800 text-sm font-medium">{value}</p>
        )}
      </div>
    </div>
  );
}