"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ClipboardList, FileText, Building } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const router = useRouter();

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

  if (!user) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 animate-gradient">
        <p className="text-white text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 animate-gradient bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 bg-size-200 bg-pos-0">
      {/* Header Section */}
      <div className="backdrop-blur-md bg-white/30 shadow-lg rounded-xl p-6 mb-8 text-center border border-white/20">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg">
          Welcome, <span className="text-yellow-300">{user.username}</span>!
        </h1>
        <p className="text-white/90 mt-2">{user.email}</p>
        <span className="inline-block mt-4 px-4 py-1 text-sm bg-yellow-400 text-gray-900 rounded-full shadow-md">
          Role: {user.role}
        </span>
        {user.company_code && (
          <p className="mt-2 text-white/80">
            Company Code: <strong>{user.company_code}</strong>
          </p>
        )}
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks Card */}
         <Link href="/view_task" className="group">
      <div className="glass-card hover:scale-105 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-blue-500/30 text-white rounded-full">
            <ClipboardList size={28} />
          </div>
          <h2 className="ml-4 text-2xl font-semibold text-white">Tasks</h2>
        </div>
        <p className="text-white/80">
          View and manage your assigned tasks efficiently.
        </p>
      </div>
    </Link>

        {/* Documents Card */}
        <div className="glass-card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-500/30 text-white rounded-full">
              <FileText size={28} />
            </div>
            <h2 className="ml-4 text-2xl font-semibold text-white">Documents</h2>
          </div>
          <p className="text-white/80">
            Access and upload important company documents.
          </p>
        </div>

        {/* Company Details Card */}
        <div className="glass-card hover:scale-105 transition-transform duration-300">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-500/30 text-white rounded-full">
              <Building size={28} />
            </div>
            <h2 className="ml-4 text-2xl font-semibold text-white">Company Details</h2>
          </div>
          <p className="text-white/80">
            Learn more about the company and its structure.
          </p>
        </div>
      </div>

      <style jsx>{`
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientMove 8s ease infinite;
        }
        @keyframes gradientMove {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        .glass-card {
          backdrop-filter: blur(12px);
          background: rgba(255, 255, 255, 0.15);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid rgba(255, 255, 255, 0.2);
          box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
          transition: all 0.3s ease;
        }
      `}</style>
    </div>
  );
}



