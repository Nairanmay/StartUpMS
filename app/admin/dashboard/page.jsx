"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Users,
  FileText,
  DollarSign,
  ClipboardCheck,
  Home,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    getUser(token)
      .then((res) => {
        if (res.data.role === "admin") {
          setUser(res.data);
        } else {
          router.push("/dashboard");
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center animated-bg">
        <Loader2 className="w-12 h-12 animate-spin text-white" />
        <style jsx>{backgroundStyles}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex animated-bg relative overflow-hidden">
      {/* Sidebar Navbar */}
      <Sidebar user={user} />

      {/* Main Content */}
      <div className="flex-1 ml-72 p-12">
        {/* Floating Shapes */}
        <div className="floating-shapes"></div>

        {/* Welcome Card */}
        <div className="relative z-10 max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-10 mb-12 border border-pink-300">
          <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-md mb-4">
           Welcome,{" "}
            <span className="font-semibold text-blue-900">{user.username}</span>{" "}
          </h1>
          <p className="text-lg text-gray-800">
          Where Ideas Meet Innovation and Become Reality.
          </p>
          {user.company_code && (
            <p className="mt-3 text-gray-700 text-sm tracking-wide">
              Company Code:{" "}
              <span className="font-semibold text-pink-600">
                {user.company_code}
              </span>
            </p>
          )}
        </div>

        {/* Admin Actions Grid */}
        <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-10">
          <Link href="/admin/employee" className="group">
            <ActionCard
              icon={
                <Users className="w-14 h-14 text-blue-400 group-hover:text-pink-500 transition" />
              }
              title="Manage Users"
              description="Add, remove, or update user accounts and permissions."
            />
          </Link>
          <Link href="/admin/pitch-deck" className="group">
            <ActionCard
              icon={
                <FileText className="w-14 h-14 text-blue-400 group-hover:text-pink-500 transition" />
              }
              title="Pitch Deck Analysis"
              description="AI Powered Pitch Deck Analyser."
            />
          </Link>
          <Link href="/admin/funding-suggestions" className="group">
            <ActionCard
              icon={
                <DollarSign className="w-14 h-14 text-blue-400 group-hover:text-pink-500 transition" />
              }
              title="Funding Suggestions"
              description="AI powered Funding Suggestions."
            />
          </Link>
          <Link href="/admin/assign_task" className="group">
            <ActionCard
              icon={
                <ClipboardCheck className="w-14 h-14 text-blue-400 group-hover:text-pink-500 transition" />
              }
              title="Assign Tasks"
              description="Assign tasks to employees and track progress."
            />
          </Link>
        </div>
      </div>

      <style jsx>{backgroundStyles}</style>
      
    </div>
    
  );
}

/* Sidebar Navbar */
function Sidebar({ user }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("access");
    router.push("/login");
  };

  const navItems = [
    { href: "/admin", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/admin/employee", label: "Manage Users", icon: <Users className="w-5 h-5" /> },
    { href: "/admin/pitch-deck", label: "Pitch Deck", icon: <FileText className="w-5 h-5" /> },
    { href: "/admin/funding-suggestions", label: "Funding", icon: <DollarSign className="w-5 h-5" /> },
    { href: "/admin/assign_task", label: "Tasks", icon: <ClipboardCheck className="w-5 h-5" /> },
  ];

  return (
<aside className="fixed top-0 left-0 h-screen w-72 bg-white bg-opacity-95 backdrop-blur-md shadow-xl border-r border-pink-200 z-20 flex flex-col justify-between">
  {/* Logo + Title Section */}
  <div>
    <div className="p-8 border-b border-pink-200 flex flex-col items-center">
      <Image
        src="/logo.png"
        alt="Logo"
        width={130}
        height={130}
        className="rounded-semi  mb-3"
      />
      <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
    </div>

    {/* Navigation */}
    <nav className="flex flex-col p-6 space-y-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-800 font-medium hover:bg-gradient-to-r hover:from-pink-200 hover:to-blue-200 hover:scale-105 transition-all"
        >
          {item.icon}
          {item.label}
        </Link>
      ))}
    </nav>
  </div>

  {/* Bottom Section */}
  <div className="p-6 border-t border-pink-200">
    <div className="mb-4 text-sm text-gray-700">
      Logged in as <span className="font-semibold">{user?.username}</span>
    </div>
    <button
      onClick={handleLogout}
      className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-pink-500 to-blue-400 text-white font-semibold px-4 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
    >
      <LogOut className="w-4 h-4" /> Logout
    </button>
  </div>
</aside>
  );
}

/* Action Cards */
function ActionCard({ icon, title, description }) {
  return (
    <div
      className="bg-white bg-opacity-90 backdrop-blur-md rounded-2xl shadow-md p-8 cursor-pointer 
      border border-pink-300 hover:shadow-2xl hover:scale-[1.07] hover:border-blue-400
      transition-transform duration-300 ease-in-out"
      style={{ height: "260px" }}
    >
      <div className="mb-6">{icon}</div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </div>
    
  );
}

/* Background Styles */
const backgroundStyles = `
.animated-bg {
  background: linear-gradient(-45deg, #89cff0, #ffb6c1, #add8e6, #ffc0cb);
  background-size: 400% 400%;
  animation: gradientBG 10s ease infinite;
}

@keyframes gradientBG {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.floating-shapes::before,
.floating-shapes::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  opacity: 0.25;
  animation: float 8s ease-in-out infinite;
}

.floating-shapes::before {
  width: 280px;
  height: 280px;
  background: #ffb6c1;
  top: -40px;
  left: -90px;
}

.floating-shapes::after {
  width: 380px;
  height: 380px;
  background: #add8e6;
  bottom: -70px;
  right: -140px;
}

@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-25px) translateX(12px); }
}
`;
