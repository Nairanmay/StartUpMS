"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";
import { Loader2, Users, FileText, DollarSign, ClipboardCheck } from "lucide-react";
import Link from "next/link";

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
      <div className="flex h-screen items-center justify-center bg-animated-gradient">
        <Loader2 className="w-12 h-12 animate-spin text-yellow-300" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-10 bg-animated-gradient">
      {/* Welcome Card */}
      <div className="max-w-4xl mx-auto bg-white bg-opacity-90 backdrop-blur-md shadow-2xl rounded-2xl p-8 mb-12 border border-yellow-400">
        <h1 className="text-4xl font-extrabold text-gray-900 drop-shadow-md mb-4">
          Admin Dashboard
        </h1>
        <p className="text-lg text-gray-800">
          Welcome,{" "}
          <span className="font-semibold text-blue-900">{user.username}</span> (
          <span className="capitalize">{user.role}</span>)
        </p>
        {user.company_code && (
          <p className="mt-2 text-gray-700 text-sm tracking-wide">
            Company Code:{" "}
            <span className="font-semibold text-yellow-600">{user.company_code}</span>
          </p>
        )}
      </div>

      {/* Admin Actions Grid */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <Link href="/admin/employee" className="group">
          <ActionCard
            icon={<Users className="w-12 h-12 text-yellow-500 group-hover:text-yellow-400 transition" />}
            title="Manage Users"
            description="Add, remove, or update user accounts and permissions."
          />
        </Link>
        <Link href="/admin/pitch-deck" className="group">
          <ActionCard
            icon={<FileText className="w-12 h-12 text-yellow-500 group-hover:text-yellow-400 transition" />}
            title="Pitch Deck Analysis"
            description="AI Powered Pitch Deck Analyser."
          />
        </Link>
        <Link href="/admin/funding-suggestions" className="group">
          <ActionCard
            icon={<DollarSign className="w-12 h-12 text-yellow-500 group-hover:text-yellow-400 transition" />}
            title="Funding Suggestions"
            description="AI powered Funding Suggestions."
          />
        </Link>
        <Link href="/admin/assign-tasks" className="group">
          <ActionCard
            icon={<ClipboardCheck className="w-12 h-12 text-yellow-500 group-hover:text-yellow-400 transition" />}
            title="Assign Tasks"
            description="Assign tasks to employees and track progress."
          />
        </Link>
      </div>
    </div>
  );
}

function ActionCard({ icon, title, description }) {
  return (
    <div className="bg-white bg-opacity-90 backdrop-blur-md rounded-xl shadow-md p-6 cursor-pointer border border-yellow-400 hover:shadow-2xl hover:scale-[1.03] transition-transform duration-300 ease-in-out">
      <div className="mb-6">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-700 text-sm leading-relaxed">{description}</p>
    </div>
  );
}
