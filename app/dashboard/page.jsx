"use client";
import { useEffect, useState } from "react";
import { getUser } from "@/lib/api";
import { useRouter } from "next/navigation";

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

  if (!user) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Welcome, {user.username}!</h1>
      <p>Your role: {user.role}</p>
    </div>
  );
}
