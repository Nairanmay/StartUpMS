"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";

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
          router.push("/dashboard"); // Redirect non-admins
        }
      })
      .catch(() => router.push("/login"));
  }, [router]);

  if (!user) return <p>Loading...</p>;

return (
  <div className="p-8">
    <h1 className="text-3xl font-bold">Admin Dashboard</h1>
    <p className="mt-2">Welcome, {user.username} (Role: {user.role})</p>
    {user.company_code && (
      <p className="mt-2">Your Company Code: <strong>{user.company_code}</strong></p>
    )}
    <div className="mt-6">
      <p className="text-gray-700">Here you can manage users, view reports, and control the system.</p>
    </div>
  </div>
);

}
