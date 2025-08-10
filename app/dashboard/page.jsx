"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { ClipboardList, FileText, Building } from "lucide-react";

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
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-600 text-lg animate-pulse">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      {/* Header Section */}
      <div className="bg-white shadow-lg rounded-xl p-6 mb-8 text-center border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome, <span className="text-blue-600">{user.username}</span>!
        </h1>
        <p className="text-gray-500 mt-2">{user.email}</p>
        <span className="inline-block mt-4 px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-full">
          Role: {user.role}
        </span>
      </div>

      {/* Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Tasks Card */}
        <div className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-xl p-6 border border-gray-100 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full">
              <ClipboardList size={24} />
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-800">Tasks</h2>
          </div>
          <p className="text-gray-500">
            View and manage your assigned tasks efficiently.
          </p>
        </div>

        {/* Documents Card */}
        <div className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-xl p-6 border border-gray-100 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-green-100 text-green-600 rounded-full">
              <FileText size={24} />
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-800">Documents</h2>
          </div>
          <p className="text-gray-500">
            Access and upload important company documents.
          </p>
        </div>

        {/* Company Details Card */}
        <div className="bg-white shadow-md hover:shadow-xl transition-shadow rounded-xl p-6 border border-gray-100 cursor-pointer">
          <div className="flex items-center mb-4">
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full">
              <Building size={24} />
            </div>
            <h2 className="ml-4 text-xl font-semibold text-gray-800">Company Details</h2>
          </div>
          <p className="text-gray-500">
            Learn more about the company and its structure.
          </p>
        </div>
      </div>
    </div>
  );
}
