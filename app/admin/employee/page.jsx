'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [companyCode, setCompanyCode] = useState(null);
  const [removingUserId, setRemovingUserId] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load theme and company code from localStorage
  useEffect(() => {
    const storedCode = localStorage.getItem("companyCode");
    const storedTheme = localStorage.getItem("theme");
    if (storedCode) setCompanyCode(storedCode);
    if (storedTheme === "dark") setDarkMode(true);
    setLoadingProfile(false);
  }, []);

  // Toggle theme
  const toggleTheme = () => {
    setDarkMode(!darkMode);
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  // Fetch user profile if no company code
  useEffect(() => {
    if (companyCode) return;
    const token = localStorage.getItem("access");
    if (!token) {
      setError("No authentication token found.");
      setLoadingProfile(false);
      return;
    }

    setLoadingProfile(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/auth/user/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const code = res.data.company_code;
        if (code) {
          setCompanyCode(code);
          localStorage.setItem("companyCode", code);
        } else {
          setError("Company code not found in user profile.");
        }
      })
      .catch(() => setError("Failed to fetch user info."))
      .finally(() => setLoadingProfile(false));
  }, [companyCode]);

  // Fetch company users
  useEffect(() => {
    if (!companyCode) return;
    const token = localStorage.getItem("access");
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    setLoadingUsers(true);
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/users/company/${companyCode}/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setUsers(res.data);
        setError("");
      })
      .catch((err) => {
        if (err.response) {
          setError(err.response.data.error || "Failed to fetch users.");
        } else {
          setError("Server not reachable.");
        }
        setUsers([]);
      })
      .finally(() => setLoadingUsers(false));
  }, [companyCode]);

  // Remove user
  const handleRemove = async (userId) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    const token = localStorage.getItem("access");
    if (!token) {
      setError("No authentication token found.");
      return;
    }

    try {
      setRemovingUserId(userId);
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/users/delete/${userId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(users.filter((u) => u.id !== userId));
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "Failed to remove user.");
      } else {
        setError("Server not reachable.");
      }
    } finally {
      setRemovingUserId(null);
    }
  };

  if (loadingProfile) return <div className="p-6">Loading user profile...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (loadingUsers) return <div className="p-6">Loading users...</div>;

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* Header with theme toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold tracking-wide animate-fadeIn">
          Manage Users
        </h1>
        <button
          onClick={toggleTheme}
          className="px-4 py-2 rounded-lg shadow-md border transition duration-300 
          hover:scale-105 hover:shadow-lg
          bg-gradient-to-r from-purple-500 to-pink-500 text-white"
        >
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>
      </div>

      {/* Table */}
      <table
        className={`min-w-full border rounded-lg shadow-lg overflow-hidden transition-all duration-500 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <thead>
          <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-100"} text-left`}>
            <th className="py-3 px-4 border-b">Name</th>
            <th className="py-3 px-4 border-b">Email</th>
            <th className="py-3 px-4 border-b">Role</th>
            <th className="py-3 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user, index) => (
              <tr
                key={user.id}
                className={`transition-all duration-300 transform hover:scale-[1.01] ${
                  index % 2 === 0
                    ? darkMode
                      ? "bg-gray-900"
                      : "bg-gray-50"
                    : darkMode
                    ? "bg-gray-800"
                    : "bg-white"
                }`}
              >
                <td className="py-3 px-4 border-b">{user.username}</td>
                <td className="py-3 px-4 border-b">{user.email}</td>
                <td className="py-3 px-4 border-b">{user.role}</td>
                <td className="py-3 px-4 border-b">
                  <button
                    onClick={() => handleRemove(user.id)}
                    disabled={removingUserId === user.id}
                    className={`px-3 py-1 rounded-lg shadow-md transition-all duration-300 
                      ${
                        removingUserId === user.id
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-red-600 hover:bg-red-700 hover:scale-105"
                      } text-white`}
                  >
                    {removingUserId === user.id ? "Removing..." : "Remove"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-6 text-center text-gray-500">
                No users found for this company.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

