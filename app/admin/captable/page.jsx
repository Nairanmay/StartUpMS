"use client";

import React, { useState, useEffect, useCallback } from "react";
import axiosClient from "../../../axiosClient";
import {
  FaPlus,
  FaTimes,
  FaUsers,
  FaFileSignature,
  FaPaperPlane,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

// Chart colors
const COLORS = [
  "#4F46E5",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
];

// --- Reusable Modal Component ---
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

// --- Main Page Component ---
const CapTablePage = () => {
  const [summary, setSummary] = useState(null);
  const [stakeholders, setStakeholders] = useState([]);
  const [securities, setSecurities] = useState([]);
  const [issuances, setIssuances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for modals
  const [isIssuanceModalOpen, setIssuanceModalOpen] = useState(false);
  const [isStakeholderModalOpen, setStakeholderModalOpen] = useState(false);
  const [isSecurityModalOpen, setSecurityModalOpen] = useState(false);

  // State for forms
  const [newIssuance, setNewIssuance] = useState({
    stakeholder: "",
    security: "",
    number_of_shares: "",
    date_issued: "",
  });
  const [newStakeholder, setNewStakeholder] = useState({
    name: "",
    stakeholder_type: "FOUNDER",
  });
  const [newSecurity, setNewSecurity] = useState({
    name: "",
    authorized_shares: "",
  });

  const fetchData = useCallback(async () => {
    try {
      const [summaryRes, stakeholdersRes, securitiesRes, issuancesRes] =
        await Promise.all([
          axiosClient.get("/api/captable/summary/"),
          axiosClient.get("/api/captable/stakeholders/"),
          axiosClient.get("/api/captable/securities/"),
          axiosClient.get("/api/captable/issuances/"),
        ]);
      setSummary(summaryRes.data);
      setStakeholders(stakeholdersRes.data);
      setSecurities(securitiesRes.data);
      setIssuances(issuancesRes.data);
      setError(null);
    } catch (err) {
      handleApiError(err);
    } finally {
      if (loading) setLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleApiError = (err) => {
    let message = "An error occurred. Please try again.";
    if (err.response) {
      if (err.response.status === 401)
        message = "Your session has expired. Please log in again.";
      else if (err.response.status === 403)
        message = "Access Denied: You do not have permission.";
      else if (err.response.data && typeof err.response.data === "object") {
        message = Object.entries(err.response.data)
          .map(([key, value]) =>
            `${key}: ${
              Array.isArray(value) ? value.join(" ") : value
            }`.toString()
          )
          .join(" ");
      }
    }
    setError(message);
    console.error("API Error:", err);
  };

  const handleCreate = async (endpoint, data, successCallback) => {
    try {
      setError(null);
      await axiosClient.post(`/api/captable/${endpoint}/`, data);
      await fetchData();
      successCallback();
    } catch (err) {
      handleApiError(err);
    }
  };

  const handleIssuanceSubmit = (e) => {
    e.preventDefault();
    handleCreate("issuances", newIssuance, () => {
      setNewIssuance({
        stakeholder: "",
        security: "",
        number_of_shares: "",
        date_issued: "",
      });
      setIssuanceModalOpen(false);
    });
  };
  const handleStakeholderSubmit = (e) => {
    e.preventDefault();
    handleCreate("stakeholders", newStakeholder, () => {
      setNewStakeholder({ name: "", stakeholder_type: "FOUNDER" });
      setStakeholderModalOpen(false);
    });
  };
  const handleSecuritySubmit = (e) => {
    e.preventDefault();
    handleCreate("securities", newSecurity, () => {
      setNewSecurity({ name: "", authorized_shares: "" });
      setSecurityModalOpen(false);
    });
  };

  // --- Prepare Pie Chart Data ---
  const pieChartData =
    summary?.holdings.map((h) => ({
      name: h.stakeholder_name,
      value: h.ownership_percentage,
    })) || [];

  // --- Prepare Line Chart Data (cumulative shares over time) ---
  const lineChartData = (() => {
    if (issuances.length === 0) return [];

    // Sort by date
    const sorted = [...issuances].sort(
      (a, b) => new Date(a.date_issued) - new Date(b.date_issued)
    );

    const cumulative = {};
    const timeline = [];

    sorted.forEach((i) => {
      const stakeholderName =
        stakeholders.find((s) => s.id === i.stakeholder)?.name || "";

      // Initialize if not present
      if (!cumulative[stakeholderName]) cumulative[stakeholderName] = 0;

      // Update cumulative shares
      cumulative[stakeholderName] += Number(i.number_of_shares);

      // Snapshot at this date
      timeline.push({
        date: i.date_issued,
        ...cumulative,
      });
    });

    return timeline;
  })();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-60">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Capitalization Table
          </h1>
          <p className="text-gray-500 mt-1">
            Manage and view your company's ownership structure.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSecurityModalOpen(true)}
            className="btn-secondary"
          >
            <FaFileSignature className="mr-2" />
            Manage Securities
          </button>
          <button
            onClick={() => setStakeholderModalOpen(true)}
            className="btn-secondary"
          >
            <FaUsers className="mr-2" />
            Manage Stakeholders
          </button>
          <button
            onClick={() => setIssuanceModalOpen(true)}
            className="btn-primary"
          >
            <FaPlus className="mr-2" />
            Add Share Issuance
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md mb-6"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {/* Pie Chart */}
      {pieChartData.length > 0 && (
        <div className="w-full h-96 mb-8">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value.toFixed(2)}%`}
                outerRadius={120}
                dataKey="value"
              >
                {pieChartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table */}
      {(!summary || summary.holdings.length === 0) ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg border">
          <h3 className="text-xl font-semibold text-gray-700">
            No Data Available
          </h3>
          <p className="text-gray-500 mt-2">
            Start by adding securities, then stakeholders, and finally issue
            shares.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto mb-8">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Stakeholder
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Shares Held
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Ownership %
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {summary.holdings.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {row.stakeholder_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        row.stakeholder_type === "FOUNDER"
                          ? "bg-green-100 text-green-800"
                          : row.stakeholder_type === "INVESTOR"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {row.stakeholder_type
                        .charAt(0)
                        .toUpperCase() +
                        row.stakeholder_type.slice(1).toLowerCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-800 text-right font-mono">
                    {row.shares_held.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right font-bold">
                    {row.ownership_percentage.toFixed(2)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Line Chart */}
      {lineChartData.length > 0 && (
        <div className="w-full h-96">
          <ResponsiveContainer>
            <LineChart data={lineChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {stakeholders.map((s, index) => (
                <Line
                  key={s.id}
                  type="monotone"
                  dataKey={s.name}
                  stroke={COLORS[index % COLORS.length]}
                  dot
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={isSecurityModalOpen}
        onClose={() => setSecurityModalOpen(false)}
        title="Add Security Type"
      >
        <form onSubmit={handleSecuritySubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Security Name (e.g., Common Stock)"
            value={newSecurity.name}
            onChange={(e) =>
              setNewSecurity({ ...newSecurity, name: e.target.value })
            }
            className="input-field"
            required
          />
          <input
            type="number"
            placeholder="Authorized Shares"
            value={newSecurity.authorized_shares}
            onChange={(e) =>
              setNewSecurity({
                ...newSecurity,
                authorized_shares: e.target.value,
              })
            }
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary w-full">
            <FaPlus className="mr-2" />
            Add Security
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isStakeholderModalOpen}
        onClose={() => setStakeholderModalOpen(false)}
        title="Add Stakeholder"
      >
        <form onSubmit={handleStakeholderSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Stakeholder Full Name"
            value={newStakeholder.name}
            onChange={(e) =>
              setNewStakeholder({ ...newStakeholder, name: e.target.value })
            }
            className="input-field"
            required
          />
          <select
            value={newStakeholder.stakeholder_type}
            onChange={(e) =>
              setNewStakeholder({
                ...newStakeholder,
                stakeholder_type: e.target.value,
              })
            }
            className="input-field"
            required
          >
            <option value="FOUNDER">Founder</option>
            <option value="INVESTOR">Investor</option>
            <option value="EMPLOYEE">Employee</option>
          </select>
          <button type="submit" className="btn-primary w-full">
            <FaPlus className="mr-2" />
            Add Stakeholder
          </button>
        </form>
      </Modal>

      <Modal
        isOpen={isIssuanceModalOpen}
        onClose={() => setIssuanceModalOpen(false)}
        title="Issue New Shares"
      >
        <form onSubmit={handleIssuanceSubmit} className="space-y-4">
          <select
            value={newIssuance.stakeholder}
            onChange={(e) =>
              setNewIssuance({ ...newIssuance, stakeholder: e.target.value })
            }
            className="input-field"
            required
          >
            <option value="">Select Stakeholder...</option>
            {stakeholders.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <select
            value={newIssuance.security}
            onChange={(e) =>
              setNewIssuance({ ...newIssuance, security: e.target.value })
            }
            className="input-field"
            required
          >
            <option value="">Select Security Type...</option>
            {securities.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            placeholder="Number of Shares"
            value={newIssuance.number_of_shares}
            onChange={(e) =>
              setNewIssuance({
                ...newIssuance,
                number_of_shares: e.target.value,
              })
            }
            className="input-field"
            required
          />
          <input
            type="date"
            placeholder="Date Issued"
            value={newIssuance.date_issued}
            onChange={(e) =>
              setNewIssuance({ ...newIssuance, date_issued: e.target.value })
            }
            className="input-field"
            required
          />
          <button type="submit" className="btn-primary w-full">
            <FaPaperPlane className="mr-2" />
            Issue Shares
          </button>
        </form>
      </Modal>

      {/* Styles */}
      <style jsx>{`
        .btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          background-color: #4f46e5;
          color: white;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: background-color 0.2s;
        }
        .btn-primary:hover {
          background-color: #4338ca;
        }
        .btn-secondary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.75rem 1.5rem;
          background-color: #e5e7eb;
          color: #374151;
          border-radius: 0.5rem;
          font-weight: 600;
          transition: background-color 0.2s;
        }
        .btn-secondary:hover {
          background-color: #d1d5db;
        }
        .input-field {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #d1d5db;
          border-radius: 0.5rem;
          outline: none;
          font-size: 1rem;
        }
        .input-field:focus {
          border-color: #4f46e5;
          ring: 2px;
        }
      `}</style>
    </div>
  );
};

export default CapTablePage;
