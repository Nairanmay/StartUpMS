"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import Lottie from "lottie-react";
import animationData from "../animations/register.json";
import Link from "next/link";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [companyCode, setCompanyCode] = useState(""); // ✅ Added for users
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // ✅ API call
  const registerUser = async (data) => {
    const response = await fetch("http://127.0.0.1:8000/auth/register/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let result;
    try {
      result = await response.json();
    } catch {
      throw new Error("Invalid response from server");
    }

    if (!response.ok) {
      throw new Error(Object.values(result).flat().join(", "));
    }

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
    password1: password,        // ✅ must match backend
    password2: confirmPassword, // ✅ must match backend
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
    setError(`Registration failed: ${err.message}`);
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient bg-[length:200%_200%]"></div>

      {/* Decorative Circles */}
      <div className="absolute top-16 left-16 w-64 h-64 bg-white/40 rounded-full animate-pulse-slow"></div>
      <div className="absolute bottom-20 right-16 w-72 h-72 bg-white/30 rounded-full animate-pulse-slow"></div>
      <div className="absolute top-1/3 left-2/3 w-52 h-52 bg-white/20 rounded-full animate-pulse-slow"></div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col md:flex-row items-center gap-20 px-8">
        {/* Lottie Animation */}
        <div className="w-[520px] h-[520px] md:w-[580px] md:h-[580px] flex justify-center">
          <Lottie animationData={animationData} loop={true} />
        </div>

        {/* Register Box */}
        <div className="w-[460px] p-14 rounded-2xl bg-white/25 backdrop-blur-xl shadow-[0_8px_32px_rgba(255,255,255,0.2)] border border-white/40">
          <h1 className="text-4xl font-bold text-white text-center mb-10">Register</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <form onSubmit={handleRegister} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/30 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-purple-400"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/30 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-purple-400"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-4 rounded-lg bg-white/30 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-purple-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-white"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            {/* Confirm Password */}
            <div>
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-4 rounded-lg bg-white/30 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-purple-400"
              />
            </div>

            {/* Role */}
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-4 rounded-lg bg-white/30 text-white outline-none focus:ring-2 focus:ring-purple-400"
            >
              <option value="user" className="bg-gray-800 text-white">
                User
              </option>
              <option value="admin" className="bg-gray-800 text-white">
                Admin
              </option>
            </select>

            {/* Company Code for User */}
            {role === "user" && (
              <input
                type="text"
                placeholder="Company Code"
                value={companyCode}
                onChange={(e) => setCompanyCode(e.target.value)}
                className="w-full p-4 rounded-lg bg-white/30 text-white placeholder-gray-200 outline-none focus:ring-2 focus:ring-purple-400"
              />
            )}

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-700 hover:bg-purple-800 text-white font-semibold p-4 rounded-lg transition-all duration-300 flex justify-center text-lg"
            >
              {loading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Register"
              )}
            </button>
          </form>

          <p className="text-center text-white mt-6">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-yellow-300 hover:text-yellow-400 font-semibold transition-colors"
            >
              Login
            </Link>
          </p>
        </div>
      </div>

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
