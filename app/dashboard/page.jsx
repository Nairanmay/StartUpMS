"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ClipboardList, FileText, Building, Home, LogOut } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const router = useRouter();

  const userNavItems = [
    { href: "/dashboard", label: "Home", icon: <Home className="w-5 h-5" /> },
    { href: "/view_task", label: "Tasks", icon: <ClipboardList className="w-5 h-5" /> },
    { href: "/dashboard/documents", label: "Documents", icon: <FileText className="w-5 h-5" /> },
    // { href: "/company", label: "Company", icon: <Building className="w-5 h-5" /> },
  ];

  useEffect(() => {
    const token = localStorage.getItem("access");
    if (!token) {
      router.push("/login");
      return;
    }

    getUser(token)
      .then((res) => setUser(res.data))
      .catch(() => router.push("/login"));
  }, [router]);

  // ✅ Logout function
  const handleLogout = () => {
    localStorage.removeItem("access");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen animated-bg relative overflow-hidden">
        <div className="floating-shapes"></div>
        <p className="text-white text-lg animate-pulse z-10">
          Loading dashboard...
        </p>
        <style jsx>{backgroundStyles}</style>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen flex transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "animated-bg text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-72 bg-white bg-opacity-95 backdrop-blur-md shadow-xl border-r border-pink-200 z-20 flex flex-col justify-between">
        {/* Logo + Title Section */}
        <div>
          <div className="p-8 border-b border-pink-200 flex flex-col items-center">
            <Image
              src="/logowb.png"
              alt="Logo"
              width={170}
              height={170}
              className="rounded-xl mb-1"
            />
            <h2 className="text-2xl font-bold text-gray-900">User Panel</h2>
          </div>

          {/* Navigation */}
          <nav className="flex flex-col p-6 space-y-4">
            {userNavItems.map((item) => (
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

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto ml-72">
        {/* Welcome Box */}
        <div className="bg-white shadow-lg rounded-xl p-6 mb-8 text-center border border-gray-200">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, <span className="text-indigo-600">{user.username}</span>!
          </h1>
          <p className="mt-2 text-gray-600">{user.email}</p>
          <span className="inline-block mt-4 px-4 py-1 text-sm bg-yellow-400 text-gray-900 rounded-full shadow-md">
            Role: {user.role}
          </span>
          {user.company_code && (
            <p className="mt-2 text-gray-700">
              Company Code: <strong>{user.company_code}</strong>
            </p>
          )}
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Tasks Card */}
          <Link href="/view_task" className="group">
            <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105 cursor-pointer">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
                  <ClipboardList size={28} />
                </div>
                <h2 className="ml-4 text-2xl font-semibold text-gray-900">
                  Tasks
                </h2>
              </div>
              <p className="text-gray-600">
                View and manage your assigned tasks efficiently.
              </p>
            </div>
          </Link>

          {/* Documents Card */}
          {/* <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 text-green-600 rounded-full">
                <FileText size={28} />
              </div>
              <h2 className="ml-4 text-2xl font-semibold text-gray-900">
                Documents
              </h2>
            </div>
            <p className="text-gray-600">
              Access and upload important company documents.
            </p>
          </div> */}

          {/* Company Details Card */}
          {/* <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-transform hover:scale-105 cursor-pointer">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
                <Building size={28} />
              </div>
              <h2 className="ml-4 text-2xl font-semibold text-gray-900">
                Company Details
              </h2>
            </div>
            <p className="text-gray-600">
              Learn more about the company and its structure.
            </p>
          </div> */}
        </div>
      </main>

      <style jsx>{backgroundStyles}</style>
    </div>
  );
}

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
  opacity: 0.3;
  animation: float 8s ease-in-out infinite;
}
.floating-shapes::before {
  width: 300px;
  height: 300px;
  background: #ffb6c1;
  top: -50px;
  left: -100px;
}
.floating-shapes::after {
  width: 400px;
  height: 400px;
  background: #add8e6;
  bottom: -80px;
  right: -150px;
}
@keyframes float {
  0%, 100% { transform: translateY(0) translateX(0); }
  50% { transform: translateY(-20px) translateX(10px); }
}
`;
