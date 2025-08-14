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
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient bg-[length:200%_200%]"></div>

      {/* Animated Shapes */}
      <div className="absolute top-16 left-16 w-56 h-56 bg-white/40 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-16 w-64 h-64 bg-white/30 rounded-full animate-pulse-slow"></div>
      <div className="absolute top-1/3 left-2/3 w-44 h-44 bg-white/20 rounded-full animate-pulse-slow"></div>

      {/* Glass effect container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-16 px-8">
        {/* Character Animation */}
        <div className="w-[650px] h-[650px] md:w-[500px] md:h-[500px] flex justify-center">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* Login Box */}
        <div className="w-[500px] h-[640px] p-14 rounded-2xl bg-white/25 backdrop-blur-xl shadow-2xl border border-white/40">
          <h1 className="text-5xl font-bold text-white text-center mb-10 pb-6">Login</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

          <form onSubmit={handleLogin} className="flex flex-col gap-8">
            {/* Username */}
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-gray-600"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold p-5 rounded-lg transition-all duration-300 flex justify-center text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* ✅ Don't have an account? */}
          <p className="text-center text-white mt-8">
            Don’t have an account?{" "}
            <Link
              href="/register"
              className="text-yellow-300 hover:text-yellow-400 font-semibold transition-colors"
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
