"use client";

import { useState } from "react";
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

const COLORS = ["#4f46e5", "#3b82f6", "#10b981"];

export default function FundingPage() {
  const [formData, setFormData] = useState({
    company_name: "",
    company_type: "",
    company_phase: "",
    founder_equity: "",
    funds_required: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("https://backend-ug9v.onrender.com/api/funding/suggest/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          founder_equity: parseFloat(formData.founder_equity),
          funds_required: parseFloat(formData.funds_required),
        }),
      });

      if (!res.ok) throw new Error("Request failed");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-6 md:p-12 relative overflow-hidden transition-colors duration-500 ${
        darkMode
          ? "bg-gray-900 text-white"
          : "bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 text-black"
      }`}
    >
      {/* Toggle */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Glow effects */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse z-0" />
      <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-300 rounded-full opacity-20 blur-2xl animate-bounce" />
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-pink-300 rounded-full opacity-20 blur-3xl animate-ping" />

      <div
        className={`relative z-10 max-w-6xl mx-auto backdrop-blur-xl shadow-2xl rounded-3xl px-8 py-12 border transition-all duration-300 hover:shadow-indigo-300 ${
          darkMode
            ? "bg-gray-800 border-gray-700"
            : "bg-white/90 border-gray-200"
        }`}
      >
        <h1
          className={`text-5xl font-extrabold text-center mb-12 drop-shadow-lg tracking-tight ${
            darkMode ? "text-indigo-300" : "text-indigo-700"
          }`}
        >
          🚀 Startup Funding Suggestion
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
        >
          <input
            className={`border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600 placeholder-gray-400"
                : "bg-white text-black border-gray-300 placeholder-gray-500"
            }`}
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />

          <select
            name="company_type"
            value={formData.company_type}
            onChange={handleChange}
            className={`border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
          >
            <option value="">Select Company Type</option>
            <option value="SaaS">SaaS</option>
            <option value="E-commerce">E-commerce</option>
            <option value="Fintech">Fintech</option>
            <option value="HealthTech">HealthTech</option>
            <option value="EdTech">EdTech</option>
            <option value="AI/ML">AI/ML</option>
          </select>

          <select
            name="company_phase"
            value={formData.company_phase}
            onChange={handleChange}
            className={`border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
          >
            <option value="">Select Phase</option>
            <option value="Pre-seed">Pre-seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Growth">Growth</option>
          </select>

          <select
            name="founder_equity"
            value={formData.founder_equity}
            onChange={handleChange}
            className={`border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
          >
            <option value="">Select Founder Equity (%)</option>
            {[...Array(21)].map((_, i) => (
              <option key={i} value={i * 5}>
                {i * 5}%
              </option>
            ))}
          </select>

          <select
            name="funds_required"
            value={formData.funds_required}
            onChange={handleChange}
            className={`border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md ${
              darkMode
                ? "bg-gray-700 text-white border-gray-600"
                : "bg-white text-black border-gray-300"
            }`}
            required
          >
            <option value="">Select Funds Required (₹)</option>
            <option value="50000">₹50,000</option>
            <option value="100000">₹1,00,000</option>
            <option value="250000">₹2,50,000</option>
            <option value="500000">₹5,00,000</option>
            <option value="900000">₹9,00,000</option>
            <option value="2000000">₹20,00,000</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 hover:scale-105 transition-transform duration-300 shadow-lg col-span-1 md:col-span-2"
          >
            {loading ? "Loading..." : "💡 Get Suggestion"}
          </button>
        </form>

        {error && (
          <p className="text-red-600 text-center text-lg font-semibold">
            {error}
          </p>
        )}

        {result && (
          <div className="space-y-8 animate-fade-in">
            <div
              className={`p-6 rounded-xl shadow-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white"
                  : "bg-indigo-50 border-indigo-200 text-black"
              }`}
            >
              <h2 className={`text-xl font-semibold ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                Investor Type
              </h2>
              <p>{result.investor_type}</p>

              <h2 className={`text-xl font-semibold mt-3 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                Equity to Dilute
              </h2>
              <p>{result.equity_to_dilute}%</p>

              <h2 className={`text-xl font-semibold mt-3 ${darkMode ? "text-indigo-300" : "text-indigo-700"}`}>
                Explanation
              </h2>
              <p>{result.explanation}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div
                className={`p-6 shadow-xl rounded-xl border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-black"
                }`}
              >
                <h3 className={`text-center font-semibold mb-4 ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                  Equity Distribution (After Investment)
                </h3>
                <PieChart width={300} height={300}>
                  <Pie
                    data={result.graphs_data.pie_chart}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {result.graphs_data.pie_chart.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <ReTooltip />
                  <Legend />
                </PieChart>
              </div>

              <div
                className={`p-6 shadow-xl rounded-xl border ${
                  darkMode
                    ? "bg-gray-800 border-gray-600 text-white"
                    : "bg-white border-gray-200 text-black"
                }`}
              >
                <h3 className={`text-center font-semibold mb-4 ${darkMode ? "text-indigo-300" : "text-indigo-600"}`}>
                  Equity Before vs After
                </h3>
                <BarChart width={350} height={300} data={result.graphs_data.bar_chart}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <ReTooltip />
                  <Legend />
                  <Bar dataKey="Before" fill="#4f46e5" />
                  <Bar dataKey="After" fill="#10b981" />
                </BarChart>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

