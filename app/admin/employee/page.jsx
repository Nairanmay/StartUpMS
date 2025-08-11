'use client';
import { useState, useEffect } from "react";
import axios from "axios";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");
  const [companyCode, setCompanyCode] = useState(null);
  const [removingUserId, setRemovingUserId] = useState(null); // Track user being removed

  // Load companyCode from localStorage on client side only
  useEffect(() => {
    const storedCode = localStorage.getItem("companyCode");
    if (storedCode) {
      setCompanyCode(storedCode);
      setLoadingProfile(false);
    }
  }, []);

  // Fetch logged-in user profile ONLY if companyCode is NOT found in localStorage
  useEffect(() => {
    if (companyCode) return; // Already have company code, no need to fetch profile

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
        if (!code) {
          setError("Company code not found in user profile.");
        } else {
          setCompanyCode(code);
          localStorage.setItem("companyCode", code);
        }
      })
      .catch(() => {
        setError("Failed to fetch user info.");
      })
      .finally(() => {
        setLoadingProfile(false);
      });
  }, [companyCode]);

  // Fetch users whenever companyCode is set
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

  // Handle remove user
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
      // Remove user from local state after success
      setUsers(users.filter((u) => u.id !== userId));
      setError("");
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
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Manage Users</h1>
      <table className="min-w-full bg-white border border-gray-200 shadow-md rounded-lg">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{user.username}</td>
                <td className="py-2 px-4 border-b">{user.email}</td>
                <td className="py-2 px-4 border-b">{user.role}</td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleRemove(user.id)}
                    disabled={removingUserId === user.id}
                    className={`text-white px-3 py-1 rounded ${
                      removingUserId === user.id ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {removingUserId === user.id ? "Removing..." : "Remove"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="py-4 text-center text-gray-500">
                No users found for this company.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
