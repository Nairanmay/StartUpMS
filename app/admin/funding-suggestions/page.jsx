// "use client";

// import { useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip as ReTooltip,
//   Legend,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// const COLORS = ["#4f46e5", "#3b82f6", "#10b981"];

// export default function FundingPage() {
//   const [formData, setFormData] = useState({
//     company_name: "",
//     company_type: "",
//     company_phase: "",
//     founder_equity: "",
//     funds_required: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       const res = await fetch("https://backend-ug9v.onrender.com/api/funding/suggest/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           founder_equity: parseFloat(formData.founder_equity),
//           funds_required: parseFloat(formData.funds_required),
//         }),
//       });

//       if (!res.ok) throw new Error("Request failed");
//       const data = await res.json();
//       setResult(data);
//     } catch (err) {
//       setError("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-r from-blue-100 via-indigo-100 to-green-100 py-12 px-6">
//       <div className="max-w-5xl mx-auto bg-white/80 backdrop-blur-md shadow-2xl rounded-3xl p-10 border border-gray-200 transition-all duration-300 hover:shadow-indigo-200">
//         <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-10 drop-shadow-md">
//           🚀 Startup Funding Suggestion
//         </h1>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
//         >
//           <input
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white placeholder-gray-500"
//             name="company_name"
//             placeholder="Company Name"
//             value={formData.company_name}
//             onChange={handleChange}
//             required
//           />

//           <select
//             name="company_type"
//             value={formData.company_type}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white text-gray-700"
//             required
//           >
//             <option value="">Select Company Type</option>
//             <option value="SaaS">SaaS</option>
//             <option value="E-commerce">E-commerce</option>
//             <option value="Fintech">Fintech</option>
//             <option value="HealthTech">HealthTech</option>
//             <option value="EdTech">EdTech</option>
//             <option value="AI/ML">AI/ML</option>
//           </select>

//           <select
//             name="company_phase"
//             value={formData.company_phase}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white text-gray-700"
//             required
//           >
//             <option value="">Select Phase</option>
//             <option value="Pre-seed">Pre-seed</option>
//             <option value="Seed">Seed</option>
//             <option value="Series A">Series A</option>
//             <option value="Series B">Series B</option>
//             <option value="Growth">Growth</option>
//           </select>

//           <select
//             name="founder_equity"
//             value={formData.founder_equity}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white text-gray-700"
//             required
//           >
//             <option value="">Select Founder Equity (%)</option>
//             {[...Array(21)].map((_, i) => (
//               <option key={i} value={i * 5}>
//                 {i * 5}%
//               </option>
//             ))}
//           </select>

//           <select
//             name="funds_required"
//             value={formData.funds_required}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white text-gray-700"
//             required
//           >
//             <option value="">Select Funds Required (₹)</option>
//             <option value="50000">₹50,000</option>
//             <option value="100000">₹1,00,000</option>
//             <option value="250000">₹2,50,000</option>
//             <option value="500000">₹5,00,000</option>
//             <option value="900000">₹9,00,000</option>
//             <option value="2000000">₹20,00,000</option>
//           </select>

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 hover:scale-105 transition-transform duration-300 shadow-lg col-span-1 md:col-span-2"
//           >
//             {loading ? "Loading..." : "💡 Get Suggestion"}
//           </button>
//         </form>

//         {/* Error */}
//         {error && <p className="text-red-600 text-center text-lg font-semibold">{error}</p>}

//         {/* Result */}
//         {result && (
//           <div className="space-y-6 animate-fade-in">
//             <div className="bg-indigo-50 p-6 rounded-xl shadow-lg border border-indigo-200">
//               <h2 className="text-xl font-semibold text-indigo-700">Investor Type</h2>
//               <p className="text-gray-700">{result.investor_type}</p>
//               <h2 className="text-xl font-semibold text-indigo-700 mt-3">Equity to Dilute</h2>
//               <p className="text-gray-700">{result.equity_to_dilute}%</p>
//               <h2 className="text-xl font-semibold text-indigo-700 mt-3">Explanation</h2>
//               <p className="text-gray-700">{result.explanation}</p>
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white p-6 shadow-xl rounded-xl border">
//                 <h3 className="text-center font-semibold mb-4 text-indigo-600">
//                   Equity Distribution (After Investment)
//                 </h3>
//                 <PieChart width={300} height={300}>
//                   <Pie
//                     data={result.graphs_data.pie_chart}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     label
//                   >
//                     {result.graphs_data.pie_chart.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <ReTooltip />
//                   <Legend />
//                 </PieChart>
//               </div>

//               <div className="bg-white p-6 shadow-xl rounded-xl border">
//                 <h3 className="text-center font-semibold mb-4 text-indigo-600">
//                   Equity Before vs After
//                 </h3>
//                 <BarChart width={350} height={300} data={result.graphs_data.bar_chart}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <ReTooltip />
//                   <Legend />
//                   <Bar dataKey="Before" fill="#4f46e5" />
//                   <Bar dataKey="After" fill="#10b981" />
//                 </BarChart>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState } from "react";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip as ReTooltip,
//   Legend,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
// } from "recharts";

// const COLORS = ["#4f46e5", "#3b82f6", "#10b981"];

// export default function FundingPage() {
//   const [formData, setFormData] = useState({
//     company_name: "",
//     company_type: "",
//     company_phase: "",
//     founder_equity: "",
//     funds_required: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const [result, setResult] = useState(null);
//   const [error, setError] = useState(null);

//   const handleChange = (e) =>
//     setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     setError(null);
//     setResult(null);

//     try {
//       const res = await fetch("https://backend-ug9v.onrender.com/api/funding/suggest/", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           ...formData,
//           founder_equity: parseFloat(formData.founder_equity),
//           funds_required: parseFloat(formData.funds_required),
//         }),
//       });

//       if (!res.ok) throw new Error("Request failed");
//       const data = await res.json();
//       setResult(data);
//     } catch (err) {
//       setError("Something went wrong!");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 p-6 md:p-12 relative overflow-hidden">
//       {/* Glow effect */}
//       <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 rounded-full blur-3xl opacity-30 animate-pulse z-0" />

//       {/* Floating shapes (optional, aesthetic) */}
//       <div className="absolute top-10 left-10 w-32 h-32 bg-indigo-300 rounded-full opacity-20 blur-2xl animate-bounce" />
//       <div className="absolute bottom-20 right-10 w-48 h-48 bg-pink-300 rounded-full opacity-20 blur-3xl animate-ping" />

//       <div className="relative z-10 max-w-6xl mx-auto bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl px-8 py-12 border border-gray-200 transition-all duration-300 hover:shadow-indigo-300">
//         <h1 className="text-5xl font-extrabold text-center text-indigo-700 mb-12 drop-shadow-lg tracking-tight">
//           🚀 Startup Funding Suggestion
//         </h1>

//         {/* Form */}
//         <form
//           onSubmit={handleSubmit}
//           className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
//         >
//           <input
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white placeholder-gray-500"
//             name="company_name"
//             placeholder="Company Name"
//             value={formData.company_name}
//             onChange={handleChange}
//             required
//           />

//           <select
//             name="company_type"
//             value={formData.company_type}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white text-gray-700"
//             required
//           >
//             <option value="">Select Company Type</option>
//             <option value="SaaS">SaaS</option>
//             <option value="E-commerce">E-commerce</option>
//             <option value="Fintech">Fintech</option>
//             <option value="HealthTech">HealthTech</option>
//             <option value="EdTech">EdTech</option>
//             <option value="AI/ML">AI/ML</option>
//           </select>

//           <select
//             name="company_phase"
//             value={formData.company_phase}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white text-gray-700"
//             required
//           >
//             <option value="">Select Phase</option>
//             <option value="Pre-seed">Pre-seed</option>
//             <option value="Seed">Seed</option>
//             <option value="Series A">Series A</option>
//             <option value="Series B">Series B</option>
//             <option value="Growth">Growth</option>
//           </select>

//           <select
//             name="founder_equity"
//             value={formData.founder_equity}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white text-gray-700"
//             required
//           >
//             <option value="">Select Founder Equity (%)</option>
//             {[...Array(21)].map((_, i) => (
//               <option key={i} value={i * 5}>
//                 {i * 5}%
//               </option>
//             ))}
//           </select>

//           <select
//             name="funds_required"
//             value={formData.funds_required}
//             onChange={handleChange}
//             className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white text-gray-700"
//             required
//           >
//             <option value="">Select Funds Required (₹)</option>
//             <option value="50000">₹50,000</option>
//             <option value="100000">₹1,00,000</option>
//             <option value="250000">₹2,50,000</option>
//             <option value="500000">₹5,00,000</option>
//             <option value="900000">₹9,00,000</option>
//             <option value="2000000">₹20,00,000</option>
//           </select>

//           <button
//             type="submit"
//             disabled={loading}
//             className="bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 hover:scale-105 transition-transform duration-300 shadow-lg col-span-1 md:col-span-2"
//           >
//             {loading ? "Loading..." : "💡 Get Suggestion"}
//           </button>
//         </form>

//         {/* Error */}
//         {error && (
//           <p className="text-red-600 text-center text-lg font-semibold">
//             {error}
//           </p>
//         )}

//         {/* Result */}
//         {result && (
//           <div className="space-y-8 animate-fade-in transition-opacity duration-700 ease-in-out">
//             <div className="bg-indigo-50 p-6 rounded-xl shadow-lg border border-indigo-200">
//               <h2 className="text-xl font-semibold text-indigo-700">Investor Type</h2>
//               <p className="text-gray-700">{result.investor_type}</p>

//               <h2 className="text-xl font-semibold text-indigo-700 mt-3">Equity to Dilute</h2>
//               <p className="text-gray-700">{result.equity_to_dilute}%</p>

//               <h2 className="text-xl font-semibold text-indigo-700 mt-3">Explanation</h2>
//               <p className="text-gray-700">{result.explanation}</p>
//             </div>

//             {/* Charts */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div className="bg-white p-6 shadow-xl rounded-xl border">
//                 <h3 className="text-center font-semibold mb-4 text-indigo-600">
//                   Equity Distribution (After Investment)
//                 </h3>
//                 <PieChart width={300} height={300}>
//                   <Pie
//                     data={result.graphs_data.pie_chart}
//                     dataKey="value"
//                     nameKey="name"
//                     cx="50%"
//                     cy="50%"
//                     outerRadius={100}
//                     label
//                   >
//                     {result.graphs_data.pie_chart.map((entry, index) => (
//                       <Cell
//                         key={`cell-${index}`}
//                         fill={COLORS[index % COLORS.length]}
//                       />
//                     ))}
//                   </Pie>
//                   <ReTooltip />
//                   <Legend />
//                 </PieChart>
//               </div>

//               <div className="bg-white p-6 shadow-xl rounded-xl border">
//                 <h3 className="text-center font-semibold mb-4 text-indigo-600">
//                   Equity Before vs After
//                 </h3>
//                 <BarChart width={350} height={300} data={result.graphs_data.bar_chart}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="name" />
//                   <YAxis />
//                   <ReTooltip />
//                   <Legend />
//                   <Bar dataKey="Before" fill="#4f46e5" />
//                   <Bar dataKey="After" fill="#10b981" />
//                 </BarChart>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

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
    <div className={`${darkMode ? "dark" : ""}`}>
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-100 to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 md:p-12 relative overflow-hidden transition-colors">
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

        <div className="relative z-10 max-w-6xl mx-auto bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl shadow-2xl rounded-3xl px-8 py-12 border border-gray-200 dark:border-gray-700 transition-all duration-300 hover:shadow-indigo-300">
          <h1 className="text-5xl font-extrabold text-center text-indigo-700 dark:text-indigo-300 mb-12 drop-shadow-lg tracking-tight">
            🚀 Startup Funding Suggestion
          </h1>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10"
          >
            <input
              className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500"
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
              className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
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
              className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
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
              className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
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
              className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-400 transition-all shadow-md bg-white dark:bg-gray-800 text-gray-700 dark:text-white"
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
              <div className="bg-indigo-50 dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-indigo-200 dark:border-gray-600">
                <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300">Investor Type</h2>
                <p className="text-gray-700 dark:text-gray-200">{result.investor_type}</p>

                <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mt-3">Equity to Dilute</h2>
                <p className="text-gray-700 dark:text-gray-200">{result.equity_to_dilute}%</p>

                <h2 className="text-xl font-semibold text-indigo-700 dark:text-indigo-300 mt-3">Explanation</h2>
                <p className="text-gray-700 dark:text-gray-200">{result.explanation}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-gray-800 p-6 shadow-xl rounded-xl border border-gray-200 dark:border-gray-600">
                  <h3 className="text-center font-semibold mb-4 text-indigo-600 dark:text-indigo-300">
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

                <div className="bg-white dark:bg-gray-800 p-6 shadow-xl rounded-xl border border-gray-200 dark:border-gray-600">
                  <h3 className="text-center font-semibold mb-4 text-indigo-600 dark:text-indigo-300">
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
    </div>
  );
}

