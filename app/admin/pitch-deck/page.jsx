"use client";
import CountUp from "react-countup";
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

const COLORS = ["#4f46e5", "#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function PitchAnalysisPage() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
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
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze pitch deck");
      }

      // Example parse from backend - customize as needed
      const resultObj = {
        summary: data.analysis_text || "",
        strengths: data.strengths || [],
        weaknesses: data.weaknesses || [],
        ratings: data.ratings || {},
        suggestions: data.suggestions || [],
      };

      setResult(resultObj);
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

// helper to highlight key phrases (simple example)
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

  // Convert ratings object to array for charts
  const ratingsData = result
    ? Object.entries(result.ratings).map(([key, value], i) => ({
        name: key,
        value,
      }))
    : [];

  return (
    <main className="min-h-screen bg-gradient-to-r from-indigo-50 via-white to-indigo-50 p-6 flex flex-col items-center">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-8 drop-shadow-md">
        Pitch Deck Analysis
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-xl shadow-xl max-w-lg w-full mb-10"
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-6 block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold rounded-lg transition-colors duration-300"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>

      {error && (
        <p className="text-red-600 bg-red-100 px-6 py-3 rounded-lg max-w-lg w-full text-center mb-6 shadow">
          {error}
        </p>
      )}

      {result && (
       <section className="bg-white rounded-xl shadow-xl max-w-5xl w-full p-8 flex flex-col md:flex-row gap-12">
  {/* Left text content */}
  <div className="flex-1 space-y-8">
    <h2 className="text-3xl font-bold text-indigo-800 mb-2">Summary</h2>
    <p
      className="text-gray-700 leading-relaxed prose max-w-none"
      dangerouslySetInnerHTML={{ __html: highlightKeywords(result.summary) }}
    />

    {["strengths", "weaknesses", "suggestions"].map((section) => (
      <div
        key={section}
        className="border rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <button
          type="button"
          onClick={() => toggleSection(section)}
          className={`w-full text-left px-6 py-3 font-semibold text-lg ${
            section === "weaknesses"
              ? "text-red-600"
              : section === "strengths"
              ? "text-green-700"
              : "text-indigo-700"
          } flex justify-between items-center focus:outline-none`}
        >
          {section.charAt(0).toUpperCase() + section.slice(1)}
          <span className="transform transition-transform duration-300">
            {expandedSections[section] ? "−" : "+"}
          </span>
        </button>
        {expandedSections[section] && (
          <ul
            className={`list-disc list-inside px-6 pb-4 ${
              section === "weaknesses"
                ? "text-red-600"
                : section === "strengths"
                ? "text-green-700"
                : "text-indigo-600"
            }`}
          >
            {result[section].length > 0 ? (
              result[section].map((item, i) => (
                <li
                  key={i}
                  className="hover:bg-indigo-50 rounded px-2 py-1 cursor-pointer transition-colors duration-200"
                  title={item}
                >
                  {item.length > 120 ? item.slice(0, 120) + "..." : item}
                </li>
              ))
            ) : (
              <p className="text-gray-500 italic px-2 py-1">
                No {section} data available.
              </p>
            )}
          </ul>
        )}
      </div>
    ))}
  </div>

  {/* Right charts */}
  <div className="flex-1 flex flex-col gap-12">
    <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
        Ratings Overview
      </h3>

      {ratingsData.length ? (
        <>
          <PieChart width={350} height={300}>
            <Pie
              data={ratingsData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) =>
                `${name}: ${(percent * 100).toFixed(0)}%`
              }
              labelLine={false}
              isAnimationActive={true}
            >
              {ratingsData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  cursor="pointer"
                />
              ))}
            </Pie>
            <ReTooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>

          <div className="mt-6 px-6">
            {ratingsData.map(({ name, value }, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center mb-2"
                title={`${name}: ${value}`}
              >
                <span className="font-semibold text-indigo-700">{name}</span>
                <div className="w-3/4 bg-indigo-200 rounded-full h-5 overflow-hidden">
                  <div
                    className="bg-indigo-600 h-5 rounded-full transition-all duration-1000"
                    style={{ width: `${value}%` }}
                  />
                </div>
                <span className="ml-3 font-mono text-indigo-900">
                  <CountUp end={value} duration={1.5} />%
                </span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p className="text-center text-gray-400 italic">No ratings data</p>
      )}
    </div>

    <div className="bg-indigo-50 p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-semibold text-indigo-700 mb-6 text-center">
        Ratings Bar Chart
      </h3>
      {ratingsData.length ? (
        <BarChart
          width={350}
          height={280}
          data={ratingsData}
          margin={{ top: 5, right: 30, left: 20, bottom: 40 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            angle={-45}
            textAnchor="end"
            interval={0}
            height={60}
          />
          <YAxis />
          <ReTooltip />
          <Bar dataKey="value" fill="#4f46e5" animationDuration={1200} />
        </BarChart>
      ) : (
        <p className="text-center text-gray-400 italic">No ratings data</p>
      )}
    </div>
  </div>
</section>
      )}
    </main>
  );
}

