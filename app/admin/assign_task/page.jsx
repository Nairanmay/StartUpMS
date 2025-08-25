"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createProject,
  createTask,
  getUsersByCompany,
  getUser,
} from "../../../lib/api";

export default function TaskAssignPage() {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("individual");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([
    { description: "", assignedTo: [], requires_document: false, document: null },
  ]);
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(true);
  const [adminFile, setAdminFile] = useState(null);

  // Fetch employees
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setError("Missing authentication token");
          return;
        }
        const userRes = await getUser(token);
        const companyCode = userRes.data?.company_code;
        if (!companyCode) {
          setError("Company code not found in user profile");
          return;
        }
        const res = await getUsersByCompany(companyCode, token);
        if (mounted) setEmployees(res.data || []);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Failed to load employees");
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const typeHint = useMemo(
    () =>
      projectType === "individual"
        ? "Individual project: each task should be assigned to exactly 1 employee."
        : "Group project: each task can be assigned to multiple employees.",
    [projectType]
  );

  const handleTaskChange = (index, field, value) => {
    const copy = [...tasks];
    copy[index][field] = value;
    setTasks(copy);
  };

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      { description: "", assignedTo: [], requires_document: false, document: null },
    ]);
  };

  const removeTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    if (!projectName.trim()) return "Project name is required.";
    if (!deadline) return "Deadline is required.";
    if (tasks.length === 0) return "Add at least one task.";
    for (let i = 0; i < tasks.length; i++) {
      const t = tasks[i];
      if (!t.description.trim()) return `Task #${i + 1} needs a description.`;
      if (projectType === "individual" && t.assignedTo.length !== 1)
        return `Task #${i + 1} must have exactly one assignee for an individual project.`;
      if (projectType === "group" && t.assignedTo.length === 0)
        return `Task #${i + 1} must have at least one assignee for a group project.`;
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const msg = validateForm();
    if (msg) {
      setError(msg);
      return;
    }

    try {
      setLoading(true);

      // Create project (FormData if file exists)
      const formData = new FormData();
      formData.append("name", projectName.trim());
      formData.append("type", projectType);
      formData.append("deadline", deadline);
      if (adminFile) formData.append("file", adminFile);

      const project = await createProject(formData, true); // multipart/form-data

      // Create tasks
      for (const t of tasks) {
        const taskData = new FormData();
        taskData.append("project_id", project.id); // ✅ use project_id
        taskData.append("description", t.description.trim());
        taskData.append("requires_document", String(t.requires_document));

        // Assigned users
        t.assignedTo.forEach((id) => taskData.append("assigned_to_ids", id));

        // Optional task document
        if (t.document) taskData.append("document", t.document);

        await createTask(taskData, true); // multipart/form-data
      }

      // Reset form
      setProjectName("");
      setProjectType("individual");
      setDeadline("");
      setTasks([{ description: "", assignedTo: [], requires_document: false, document: null }]);
      setAdminFile(null);
      alert("Project and tasks created successfully ✨");
    } catch (err) {
      console.error(err);
      setError("Error creating project or tasks. Check console for details.");
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
      {/* Toggle Dark Mode */}
      <div className="absolute top-6 right-6 z-50">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 transition"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Form Card */}
      <div
        className={`p-6 max-w-4xl mx-auto rounded-2xl shadow-xl transform transition-all duration-500 ${
          darkMode
            ? "bg-gray-800/90 backdrop-blur text-white shadow-indigo-500/20"
            : "bg-white/80 backdrop-blur text-gray-900 shadow-xl"
        }`}
      >
        <h1 className="text-2xl font-bold mb-2">Assign Project & Tasks</h1>
        <p className={`text-sm mb-6 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
          {typeHint}
        </p>

        {error && <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Project Name</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className={`p-2 w-full rounded transition-colors ${
                darkMode
                  ? "bg-gray-700 border border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
              placeholder="e.g. Website Redesign"
              required
            />
          </div>

          {/* Project Type + Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Project Type</label>
              <select
                value={projectType}
                onChange={(e) => setProjectType(e.target.value)}
                className={`p-2 w-full rounded transition-colors ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-white"
                    : "bg-white border border-gray-300 text-gray-900"
                }`}
              >
                <option value="individual">Individual</option>
                <option value="group">Group</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Deadline</label>
              <input
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                className={`p-2 w-full rounded transition-colors ${
                  darkMode
                    ? "bg-gray-700 border border-gray-600 text-white"
                    : "bg-white border border-gray-300 text-gray-900"
                }`}
                required
              />
            </div>
          </div>

          {/* Admin File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">Upload File (Admin)</label>
            <input
              type="file"
              onChange={(e) => setAdminFile(e.target.files[0])}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 
                         file:px-4 file:rounded-full file:border-0
                         file:text-sm file:font-semibold
                         file:bg-indigo-50 file:text-indigo-700
                         hover:file:bg-indigo-100"
            />
          </div>

          {/* Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Tasks</h2>
              <button
                type="button"
                onClick={addTask}
                className="px-3 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                + Add Task
              </button>
            </div>

            {tasks.map((task, index) => (
              <div
                key={index}
                className={`rounded-xl p-4 space-y-3 transition-colors ${
                  darkMode ? "bg-gray-700 border border-gray-600" : "bg-gray-100 border border-gray-300"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Task #{index + 1}</span>
                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTask(index)}
                      className="text-sm text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <input
                    type="text"
                    value={task.description}
                    onChange={(e) => handleTaskChange(index, "description", e.target.value)}
                    className={`p-2 w-full rounded transition-colors ${
                      darkMode
                        ? "bg-gray-600 border border-gray-500 text-white placeholder-gray-400"
                        : "bg-white border border-gray-300 text-gray-900 placeholder-gray-500"
                    }`}
                    placeholder="e.g. Set up CI/CD pipeline"
                    required
                  />
                </div>

                {/* Assign Employees */}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Assign Employee{projectType === "group" ? "(s)" : ""}
                  </label>
                  <select
                    multiple={projectType === "group"}
                    value={projectType === "group" ? task.assignedTo : task.assignedTo[0] || ""}
                    onChange={(e) =>
                      handleTaskChange(
                        index,
                        "assignedTo",
                        projectType === "group"
                          ? Array.from(e.target.selectedOptions, (opt) => opt.value)
                          : [e.target.value]
                      )
                    }
                    className={`p-2 w-full rounded min-h-10 transition-colors ${
                      darkMode
                        ? "bg-gray-600 border border-gray-500 text-white"
                        : "bg-white border border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="" disabled>
                      {employees.length ? "Select…" : "No employees found"}
                    </option>
                    {employees.map((emp) => (
                      <option key={emp.id} value={String(emp.id)}>
                        {emp.username} {emp.email ? `(${emp.email})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Task Document */}
                <div>
                  <label className="block text-sm font-medium mb-1">Upload Task Document (optional)</label>
                  <input
                    type="file"
                    onChange={(e) => handleTaskChange(index, "document", e.target.files[0])}
                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 
                               file:px-4 file:rounded-full file:border-0
                               file:text-sm file:font-semibold
                               file:bg-indigo-50 file:text-indigo-700
                               hover:file:bg-indigo-100"
                  />
                </div>

                {/* Require File */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={task.requires_document}
                    onChange={(e) =>
                      handleTaskChange(index, "requires_document", e.target.checked)
                    }
                  />
                  <label className="text-sm">
                    Require employee to upload file for this task
                  </label>
                </div>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Saving..." : "Create Project & Tasks"}
          </button>
        </form>
      </div>
    </div>
  );
}
