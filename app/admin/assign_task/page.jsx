"use client";

import { useEffect, useMemo, useState } from "react";
import {
  createProject,
  createTask,
  getUsersByCompany,
  getUser, // <-- keep same name as in your api.js
} from "../../../lib/api";

export default function TaskAssignPage() {
  const [loading, setLoading] = useState(false);
  const [employees, setEmployees] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [projectType, setProjectType] = useState("individual");
  const [deadline, setDeadline] = useState("");
  const [tasks, setTasks] = useState([{ description: "", assignedTo: [] }]);
  const [error, setError] = useState("");

  // Fetch employees for the logged-in company
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const token = localStorage.getItem("access");
        if (!token) {
          setError("Missing authentication token");
          return;
        }

        // 1. Fetch current user details
        const userRes = await getUser(token); // returns { company_code: "...", ... }
        const companyCode = userRes.data?.company_code;
        if (!companyCode) {
          setError("Company code not found in user profile");
          return;
        }

        // 2. Fetch employees in the company
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
    setTasks((prev) => [...prev, { description: "", assignedTo: [] }]);
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
      const project = await createProject({
        name: projectName.trim(),
        type: projectType,
        deadline,
      });

      for (const t of tasks) {
        await createTask({
          project: project.id,
          description: t.description.trim(),
          assigned_to_ids: t.assignedTo,
        });
      }

      setProjectName("");
      setProjectType("individual");
      setDeadline("");
      setTasks([{ description: "", assignedTo: [] }]);
      alert("Project and tasks created successfully ✨");
    } catch (err) {
      console.error(err);
      setError("Error creating project or tasks. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">Assign Project & Tasks</h1>
      <p className="text-sm text-gray-600 mb-6">{typeHint}</p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1">Project Name</label>
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="border p-2 w-full rounded"
            placeholder="e.g. Website Redesign"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Project Type</label>
            <select
              value={projectType}
              onChange={(e) => setProjectType(e.target.value)}
              className="border p-2 w-full rounded"
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
              className="border p-2 w-full rounded"
              required
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Tasks</h2>
            <button
              type="button"
              onClick={addTask}
              className="px-3 py-1 rounded bg-gray-800 text-white"
            >
              + Add Task
            </button>
          </div>

          {tasks.map((task, index) => (
            <div key={index} className="border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Task #{index + 1}</span>
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

              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <input
                  type="text"
                  value={task.description}
                  onChange={(e) =>
                    handleTaskChange(index, "description", e.target.value)
                  }
                  className="border p-2 w-full rounded"
                  placeholder="e.g. Set up CI/CD pipeline"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Assign Employee{projectType === "group" ? "(s)" : ""}
                </label>
                <select
                  multiple={projectType === "group"}
                  value={
                    projectType === "group"
                      ? task.assignedTo
                      : task.assignedTo[0] || "" // <-- FIX scalar value for individual
                  }
                  onChange={(e) =>
                    handleTaskChange(
                      index,
                      "assignedTo",
                      projectType === "group"
                        ? Array.from(e.target.selectedOptions, (opt) => opt.value)
                        : [e.target.value] // <-- store in array even for single
                    )
                  }
                  className="border p-2 w-full rounded min-h-10"
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
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-60"
        >
          {loading ? "Saving..." : "Create Project & Tasks"}
        </button>
      </form>
    </div>
  );
}
