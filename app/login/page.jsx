"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginUser, getUser } from "@/lib/api";
import { Eye, EyeOff } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../animations/login-character.json";
import Link from "next/link";

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
      console.log("Login success:", data);

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
      console.error("Login error:", err.response?.data || err.message);
      setError("Invalid username or password");
    } finally {
      setLoading(false);
    }
  };


  if (!mounted) {
    return null;
  }

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Moving Gradient Background */}
      {/* Moving Gradient Background */}
<div className="absolute inset-0 bg-gradient-to-br from-[#A0D8F1] via-[#C2B9F0] to-[#FFB28A] animate-gradient bg-[length:200%_200%]"></div>

{/* Subtle Dark Accent Gradient */}
<div className="absolute inset-0 bg-gradient-to-br from-[#123B70]/10 via-[#0A243F]/10 to-[#FF7A33]/10 animate-gradient bg-[length:200%_200%] mix-blend-soft-light"></div>

{/* Darker Floating Circles */}
<div className="absolute top-16 left-16 w-72 h-72 bg-[#123B70]/20 rounded-full animate-pulse-slow"></div>
<div className="absolute bottom-20 right-16 w-80 h-80 bg-[#0A243F]/15 rounded-full animate-pulse-slow"></div>
<div className="absolute top-1/3 left-2/3 w-60 h-60 bg-[#FF7A33]/10 rounded-full animate-pulse-slow"></div>

{/* Additional Dark Animated Shapes */}
<div className="absolute top-16 left-16 w-56 h-56 bg-[#123B70]/25 rounded-full animate-pulse-slow"></div>
<div className="absolute bottom-20 right-16 w-64 h-64 bg-[#0A243F]/20 rounded-full animate-pulse-slow"></div>
<div className="absolute top-1/3 left-2/3 w-44 h-44 bg-[#FF7A33]/15 rounded-full animate-pulse-slow"></div>

<style jsx>{`
  @keyframes gradientMove {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  .animate-gradient {
    animation: gradientMove 12s ease infinite;
  }

  @keyframes pulseSlow {
    0%, 100% { transform: scale(1); opacity: 0.6; }
    50% { transform: scale(1.3); opacity: 0.3; }
  }
  .animate-pulse-slow {
    animation: pulseSlow 14s ease-in-out infinite;
  }
`}</style>


      {/* Glass effect container */}
     {/* Glass effect container */}
<div className="relative z-10 flex flex-col md:flex-row items-center gap-16 px-8">
  
  {/* Character Animation */}
  <div className="z-10 flex flex-col items-center text-center mb-1 px-4">
  <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
    Welcome to <span className="text-yellow-300">Startify</span>
  </h1>
  <p className="text-lg md:text-xl text-black-200 mt-2 font-bold">
    Where startups get started 🚀
  </p>

  {/* Existing Lottie Animation */}
  <Lottie animationData={animationData} loop={true} className="w-64 h-64 md:w-150 md:h-150 " />
</div>

  {/* Login Box */}
 <div className="w-[500px] h-[640px] p-14 pt-6 rounded-2xl bg-black/20 backdrop-blur-2xl shadow-2xl border border-white/30 flex flex-col items-center text-center">
  {/* Logo */}
  <img
    src="/logowb.png"
    alt="Logo"
    className="w-54 h-54 object-contain "
  />

  <h1 className="text-5xl font-extrabold text-white mb-10 pb-6 drop-shadow-lg">
    Login
  </h1>
  {error && <p className="text-red-400 font-semibold mb-4">{error}</p>}

  <form onSubmit={handleLogin} className="flex flex-col gap-8 w-full">
    {/* Username */}
    <input
      type="text"
      placeholder="Username"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      className="w-full p-5 rounded-lg border-2 border-gray-500 bg-black/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
      required
    />

    {/* Password */}
    <div className="relative">
      <input
        type={showPassword ? "text" : "password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-5 rounded-lg border-2 border-gray-500 bg-black/20 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-inner"
        required
      />
      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute right-4 top-4 text-gray-400 hover:text-white transition-colors"
      >
        {showPassword ? <EyeOff /> : <Eye />}
      </button>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={loading}
      className="bg-gradient-to-r from-purple-700 to-purple-900 hover:from-purple-800 hover:to-purple-950 text-white font-semibold p-5 rounded-lg transition-all duration-300 flex justify-center text-lg shadow-lg hover:scale-105"
    >
      {loading ? (
        <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
      ) : (
        "Login"
      )}
    </button>
  </form>

  {/* ✅ Don't have an account? */}
  <p className="text-gray-300 mt-8">
    Don’t have an account?{" "}
    <Link
      href="/register"
      className="text-yellow-400 hover:text-yellow-300 font-semibold transition-colors"
    >
      Create one
    </Link>
  </p>
</div>

</div>


      {/* Animations */}
      <style jsx>{`
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
        .animate-gradient {
          animation: gradientMove 6s ease infinite;
        }
        @keyframes pulseSlow {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.4;
          }
        }
        .animate-pulse-slow {
          animation: pulseSlow 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
