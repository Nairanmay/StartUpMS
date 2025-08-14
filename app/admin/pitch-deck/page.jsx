

"use client";

import CountUp from "react-countup";
import { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip as ReTooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { motion, AnimatePresence } from "framer-motion";
import { Upload } from "lucide-react";

export default function PitchAnalysisPage() {
  const DARK_COLORS = ["#6366f1", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];
  const LIGHT_COLORS = ["#4f46e5", "#2563eb", "#059669", "#d97706", "#dc2626", "#7c3aed"];

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isDark, setIsDark] = useState(true);
  const [fastBg, setFastBg] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
    setFastBg(true);
    setTimeout(() => setFastBg(false), 2000);
  };

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile && uploadedFile.type !== "application/pdf") {
      setError("Only PDF files are allowed.");
      setFile(null);
      return;
    }
    setFile(uploadedFile);
    setResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a PDF file.");
      return;
    }

    const token = localStorage.getItem("access");
    if (!token) {
      setError("You must be logged in to analyze pitch decks.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch(
        "https://backend-ug9v.onrender.com/api/pitchdeck/analyze/",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to analyze pitch deck");

      setResult({
        summary: data.analysis_text || "",
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        ratings: data.ratings || {},
        suggestions: data.suggestions || [],
      });
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const [expandedSections, setExpandedSections] = useState({
    strengths: true,
    weaknesses: false,
    suggestions: false,
  });

  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const highlightKeywords = (text) => {
    const keywords = ["strength", "weakness", "suggestion", "important", "note"];
    let formatted = text;
    keywords.forEach((word) => {
      const regex = new RegExp(`(${word})`, "gi");
      formatted = formatted.replace(
        regex,
        `<mark class="bg-indigo-100 text-indigo-800 font-semibold rounded px-1">$1</mark>`
      );
    });
    return formatted;
  };

  const ratingsData = result
    ? Object.entries(result.ratings).map(([key, value]) => ({
        name: key,
        value,
      }))
    : [];

  return (
    <main
      className={`min-h-screen p-6 flex flex-col items-center transition-colors duration-500 ${
        isDark ? "bg-dark-animated text-white" : "bg-light-animated text-black"
      }`}
    >
      <style jsx global>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .bg-dark-animated {
          background: linear-gradient(-45deg, #0b0c2a, #14164d, #1f1b4d, #0b0c2a);
          background-size: 400% 400%;
          animation: gradientShift ${fastBg ? "2s" : "15s"} ease infinite;
        }
        .bg-light-animated {
          background: linear-gradient(-45deg, #dbeafe, #f0fdfa, #e0f2fe, #fef9c3);
          background-size: 400% 400%;
          animation: gradientShift ${fastBg ? "2s" : "15s"} ease infinite;
        }
      `}</style>

      {/* Theme Toggle */}
      <button
        onClick={toggleTheme}
        className={`self-end mb-4 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
          isDark ? "bg-yellow-400 hover:bg-yellow-300 text-black" : "bg-indigo-500 hover:bg-indigo-700 text-white"
        }`}
      >
        Toggle {isDark ? "Light" : "Dark"} Mode
      </button>

      {/* Title */}
      <motion.h1
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1 }}
        className={`text-5xl font-extrabold mb-10 tracking-wide text-center drop-shadow-lg ${
          isDark ? "text-white" : "text-gray-900"
        }`}
      >
        🚀 Pitch Deck Analysis
      </motion.h1>

      {/* Upload Form */}
      <motion.form
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        onSubmit={handleSubmit}
        className={`backdrop-blur-md p-8 rounded-2xl shadow-2xl max-w-lg w-full mb-10 border ${
          isDark ? "bg-white/10 border-white/20" : "bg-white border-gray-300"
        }`}
      >
        <label
          htmlFor="file-upload"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
            isDark
              ? "border-indigo-400 hover:border-indigo-300 bg-gray-900/40"
              : "border-indigo-500 hover:border-indigo-400 bg-indigo-50"
          }`}
        >
          <Upload className={`mb-2 ${isDark ? "text-indigo-300" : "text-indigo-600"}`} size={28} />
          <span className={`text-lg font-medium ${isDark ? "text-white" : "text-gray-700"}`}>
            {file ? file.name : "Choose a PDF File"}
          </span>
          <input id="file-upload" type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold rounded-lg transition-all duration-300 shadow-lg hover:scale-105"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </motion.form>

      {/* Error */}
      {error && (
        <p className={`px-6 py-3 rounded-lg max-w-lg w-full text-center mb-6 shadow ${
          isDark ? "bg-red-200 text-red-800" : "bg-red-100 text-red-600"
        }`}>
          {error}
        </p>
      )}

      {/* Results */}
      {result && (
        <motion.section
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className={`rounded-xl shadow-xl w-full max-w-7xl p-8 grid grid-cols-1 lg:grid-cols-2 gap-12 ${
            isDark ? "bg-gray-900/80" : "bg-white/80"
          }`}
        >
          {/* Left */}
          <div>
            <h2 className={`text-3xl font-bold mb-4 ${isDark ? "text-indigo-300" : "text-indigo-800"}`}>
              Summary
            </h2>
            <p className={`${isDark ? "text-gray-300" : "text-gray-700"}`}
              dangerouslySetInnerHTML={{ __html: highlightKeywords(result.summary) }}
            />

            {/* Strengths, Weaknesses, Suggestions */}
            {["strengths", "weaknesses", "suggestions"].map((section) => (
              <div key={section} className="mt-6">
                <button
                  type="button"
                  onClick={() => toggleSection(section)}
                  className={`w-full text-left px-4 py-2 font-semibold flex justify-between items-center rounded-lg shadow-md transition-colors duration-300 ${
                    section === "weaknesses"
                      ? isDark
                        ? "bg-red-900/40 text-red-300 hover:bg-red-900/60"
                        : "bg-red-100 text-red-700 hover:bg-red-200"
                      : section === "strengths"
                      ? isDark
                        ? "bg-green-900/40 text-green-300 hover:bg-green-900/60"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                      : isDark
                        ? "bg-indigo-900/40 text-indigo-300 hover:bg-indigo-900/60"
                        : "bg-indigo-100 text-indigo-700 hover:bg-indigo-200"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                  {expandedSections[section] ? "−" : "+"}
                </button>
                <AnimatePresence>
                  {expandedSections[section] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="grid gap-3 mt-3"
                    >
                      {result[section].map((item, i) => (
                        <div
                          key={i}
                          className={`p-3 rounded-lg shadow-sm transition-colors duration-200 ${
                            isDark
                              ? "bg-gray-800 hover:bg-gray-700 text-gray-100"
                              : "bg-white hover:bg-gray-50 text-gray-900"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* Right */}
          <div className="space-y-8">
            {/* Pie Chart */}
            <div className={`${isDark ? "bg-gray-800" : "bg-indigo-50"} p-6 rounded-lg shadow-lg`}>
              <h3 className="text-xl font-bold mb-4 text-center">Ratings Overview</h3>
              <PieChart width={400} height={300}>
                <Pie
                  data={ratingsData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  label
                  isAnimationActive
                >
                  {ratingsData.map((entry, index) => (
                    <Cell key={index} fill={(isDark ? DARK_COLORS : LIGHT_COLORS)[index % 6]} />
                  ))}
                </Pie>
                <ReTooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#ffffff",
                    color: isDark ? "#ffffff" : "#111827", // Changed to white in dark mode
                    borderRadius: "8px",
                    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                  }}
                />
                <Legend />
              </PieChart>
            </div>

            {/* Bar Chart */}
            <div className={`${isDark ? "bg-gray-800" : "bg-indigo-50"} p-6 rounded-lg shadow-lg`}>
              <h3 className="text-xl font-bold mb-4 text-center">Ratings Bar Chart</h3>
              <BarChart width={400} height={300} data={ratingsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  interval={0} 
                  angle={-20} 
                  textAnchor="end" 
                  height={80} // Increased height for bottom margin
                />
                <YAxis />
                <ReTooltip
                  contentStyle={{
                    backgroundColor: isDark ? "#1f2937" : "#ffffff",
                    color: isDark ? "#ffffff" : "#111827", // Changed to white in dark mode
                    borderRadius: "8px",
                    border: `1px solid ${isDark ? "#4b5563" : "#d1d5db"}`,
                    boxShadow: "0px 4px 12px rgba(0,0,0,0.2)",
                  }}
                />
                <Bar
                  dataKey="value"
                  fill={`url(#colorUv)`}
                  radius={[10, 10, 0, 0]}
                />
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.9} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.7} />
                  </linearGradient>
                </defs>
              </BarChart>
            </div>
          </div>
        </motion.section>
      )}
    </main>
  );
}







