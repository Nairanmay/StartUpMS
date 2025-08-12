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
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-xl p-8">
        <h1 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Startup Funding Suggestion
        </h1>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8"
        >
          {/* Company Name */}
          <input
            className="border p-3 rounded"
            name="company_name"
            placeholder="Company Name"
            value={formData.company_name}
            onChange={handleChange}
            required
          />

          {/* Company Type */}
          <select
            name="company_type"
            value={formData.company_type}
            onChange={handleChange}
            className="border p-3 rounded"
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

          {/* Company Phase */}
          <select
            name="company_phase"
            value={formData.company_phase}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          >
            <option value="">Select Phase</option>
            <option value="Pre-seed">Pre-seed</option>
            <option value="Seed">Seed</option>
            <option value="Series A">Series A</option>
            <option value="Series B">Series B</option>
            <option value="Growth">Growth</option>
          </select>

          {/* Founder Equity */}
          <select
            name="founder_equity"
            value={formData.founder_equity}
            onChange={handleChange}
            className="border p-3 rounded"
            required
          >
            <option value="">Select Founder Equity (%)</option>
            {[...Array(21)].map((_, i) => (
              <option key={i} value={i * 5}>
                {i * 5}%
              </option>
            ))}
          </select>

          {/* Funds Required */}
          <select
            name="funds_required"
            value={formData.funds_required}
            onChange={handleChange}
            className="border p-3 rounded"
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
            className="bg-indigo-600 text-white py-3 rounded hover:bg-indigo-700 transition"
          >
            {loading ? "Loading..." : "Get Suggestion"}
          </button>
        </form>

        {/* Result */}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {result && (
          <div className="space-y-6">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h2 className="text-lg font-semibold">Investor Type</h2>
              <p>{result.investor_type}</p>
              <h2 className="text-lg font-semibold mt-2">Equity to Dilute</h2>
              <p>{result.equity_to_dilute}%</p>
              <h2 className="text-lg font-semibold mt-2">Explanation</h2>
              <p>{result.explanation}</p>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="bg-white p-4 shadow rounded-lg">
                <h3 className="text-center font-semibold mb-2">
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
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <ReTooltip />
                  <Legend />
                </PieChart>
              </div>

              {/* Bar Chart */}
              <div className="bg-white p-4 shadow rounded-lg">
                <h3 className="text-center font-semibold mb-2">
                  Equity Before vs After
                </h3>
                <BarChart
                  width={350}
                  height={300}
                  data={result.graphs_data.bar_chart}
                >
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
