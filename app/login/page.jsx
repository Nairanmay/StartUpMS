"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, getUser } from "@/lib/api";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import Link from "next/link";
import animationData from "../animations/login-character.json";

export default function LoginPage() {
  const [mounted, setMounted] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data } = await loginUser(username, password);
      localStorage.setItem("access", data.access);
      localStorage.setItem("refresh", data.refresh);

      const userRes = await getUser(data.access);
      const role = userRes.data.role;

      if (role === "admin") {
        router.push("/admin/dashboard");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* --- LEFT SIDE: Visuals --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0D2A4D] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/globe.svg')] bg-cover bg-center"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#FF6B1A] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

        {/* Logo Area */}
        <div className="relative z-10 flex items-center gap-2">
           <img src="/logowb.png" alt="Logo" className="w-10 h-auto" />
           <span className="font-bold text-xl tracking-tight">Startify</span>
        </div>

        {/* Center Content */}
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="bg-white/5 backdrop-blur-sm p-8 rounded-full mb-8 shadow-2xl border border-white/10">
            <Lottie animationData={animationData} loop={true} className="w-64 h-64" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Welcome back, Founder! 🚀</h2>
          <p className="text-blue-100 max-w-md leading-relaxed">
            Access your dashboard to track tasks, manage equity, and secure your next round of funding.
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 text-sm text-blue-200/60">
          © {new Date().getFullYear()} Startify Inc.
        </div>
      </div>

      {/* --- RIGHT SIDE: Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md bg-white p-8 sm:p-10 rounded-3xl shadow-xl border border-slate-100"
        >
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Sign in</h1>
            <p className="text-slate-500">Enter your details to access your account</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]/20 focus:border-[#FF6B1A] transition-all"
                placeholder="Enter your username"
                required
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-semibold text-slate-700">Password</label>
                <a href="#" className="text-sm font-medium text-[#FF6B1A] hover:text-orange-600">Forgot password?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]/20 focus:border-[#FF6B1A] transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FF6B1A] hover:bg-[#e05a15] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Don’t have an account?{" "}
            <Link href="/register" className="font-bold text-[#FF6B1A] hover:text-orange-600">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}