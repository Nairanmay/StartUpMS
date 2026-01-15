"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft, CheckCircle2 } from "lucide-react";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import Link from "next/link";
import animationData from "../animations/register.json";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [companyCode, setCompanyCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const registerUser = async (data) => {
    const response = await fetch("https://backend-ug9v.onrender.com/auth/register/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    let result;
    try { result = await response.json(); } catch { throw new Error("Invalid response"); }
    if (!response.ok) throw new Error(Object.values(result).flat().join(", "));
    return result;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const payload = {
      username,
      email,
      password1: password,
      password2: confirmPassword,
      role,
    };

    if (role === "user") {
      if (!companyCode) {
        setError("Company Code is required for users");
        setLoading(false);
        return;
      }
      payload.company_code = companyCode;
    }

    try {
      await registerUser(payload);
      router.push("/login");
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      
      {/* --- LEFT SIDE: Visuals --- */}
      <div className="hidden lg:flex lg:w-1/2 bg-[#0D2A4D] relative overflow-hidden flex-col justify-between p-12 text-white">
        {/* Background Patterns */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('/globe.svg')] bg-cover bg-center"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-tr from-blue-600/30 to-purple-600/30 rounded-full blur-3xl"></div>

        <div className="relative z-10 flex items-center gap-2">
           <img src="/logowb.png" alt="Logo" className="w-10 h-auto" />
           <span className="font-bold text-xl tracking-tight">Startify</span>
        </div>

        <div className="relative z-10 px-8">
          <Lottie animationData={animationData} loop={true} className="w-full max-w-md mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-6 text-center">Join the Ecosystem 🌍</h2>
          <div className="space-y-4 max-w-sm mx-auto text-blue-100">
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-blue-500/20"><CheckCircle2 size={16} /></div>
              <span>Manage Tasks & Equity</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-blue-500/20"><CheckCircle2 size={16} /></div>
              <span>AI Pitch Deck Analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-1 rounded-full bg-blue-500/20"><CheckCircle2 size={16} /></div>
              <span>Connect with Investors</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-blue-200/60 text-center">
          Building the future, one startup at a time.
        </div>
      </div>

      {/* --- RIGHT SIDE: Form --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative overflow-y-auto">
        <Link href="/" className="absolute top-8 left-8 text-slate-400 hover:text-slate-600 flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-500">Get started with your free 14-day trial</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]/20 focus:border-[#FF6B1A]"
                  placeholder="johndoe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]/20 focus:border-[#FF6B1A]"
                placeholder="john@example.com"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]/20 focus:border-[#FF6B1A]"
                    placeholder="••••••••"
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Confirm</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]/20 focus:border-[#FF6B1A]"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="block text-sm font-semibold text-slate-700 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-3 p-1 bg-slate-100 rounded-xl">
                <button
                  type="button"
                  onClick={() => setRole("user")}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${role === "user" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Employee
                </button>
                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`py-2 rounded-lg text-sm font-semibold transition-all ${role === "admin" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  Founder (Admin)
                </button>
              </div>
            </div>

            <motion.div 
               initial={false}
               animate={{ height: role === "user" ? "auto" : 0, opacity: role === "user" ? 1 : 0 }}
               className="overflow-hidden"
            >
              <label className="block text-sm font-semibold text-slate-700 mb-1.5 mt-2">Company Code</label>
              <input
                type="text"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#FF6B1A]/20 focus:border-[#FF6B1A]"
                placeholder="Enter code provided by admin"
              />
            </motion.div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-[#FF6B1A] hover:bg-[#e05a15] text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-orange-200 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
            </button>
          </form>

          <p className="mt-8 text-center text-slate-500 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="font-bold text-[#FF6B1A] hover:text-orange-600">
              Sign In
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}