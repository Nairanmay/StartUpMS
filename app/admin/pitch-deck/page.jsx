"use client";
import { useState } from "react";

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
    const res = await fetch("https://backend-ug9v.onrender.com/api/pitchdeck/analyze/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Failed to analyze pitch deck");
    }

    const resultObj = {
      summary: data.analysis_text || "",
      strengths: [],      // or parse if backend sends
      weaknesses: [],
      ratings: data.ratings || {},
      suggestions: [],
    };

    setResult(resultObj);

  } catch (err) {
    setError(err.message);
    setResult(null);
  } finally {
    setLoading(false);
  }
};

    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-100">
        <h1 className="text-3xl font-bold mb-6">Pitch Deck Analysis</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-lg"
      >
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="mb-4 block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer focus:outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>
      </form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {result && (
        <div className="mt-6 bg-white p-6 rounded-xl shadow-md w-full max-w-3xl">
          {typeof result === "string" ? (
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-2">Summary</h2>
              <p className="mb-4">{result.summary}</p>

              <h3 className="font-semibold">Strengths</h3>
              <ul className="list-disc ml-6 mb-4">
                {result.strengths?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>

              <h3 className="font-semibold">Weaknesses</h3>
              <ul className="list-disc ml-6 mb-4">
                {result.weaknesses?.map((w, i) => (
                  <li key={i}>{w}</li>
                ))}
              </ul>

              <h3 className="font-semibold">Ratings</h3>
              <pre className="mb-4">{JSON.stringify(result.ratings, null, 2)}</pre>

              <h3 className="font-semibold">Suggestions</h3>
              <ul className="list-disc ml-6">
                {result.suggestions?.map((s, i) => (
                  <li key={i}>{s}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </main>
  );
}
