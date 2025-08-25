"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getProjectsWithTasks,
  markTaskCompleted,
  removeProject,
  uploadTaskDocument,
} from "@/lib/api";

export default function MyTasksPage() {
  const [projects, setProjects] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [uploading, setUploading] = useState({});
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const data = await getProjectsWithTasks();
    setProjects(data);
  };

  const toggleExpand = (projectId) => {
    setExpanded((prev) => ({ ...prev, [projectId]: !prev[projectId] }));
  };

  const handleMarkDone = async (taskId, projectId) => {
    try {
      await markTaskCompleted(taskId);
      setProjects((prevProjects) =>
        prevProjects.map((project) => {
          if (project.id === projectId) {
            return {
              ...project,
              tasks: project.tasks.filter((task) => task.id !== taskId),
            };
          }
          return project;
        })
      );
    } catch (err) {
      console.error(err);
      alert("Task not found or already deleted");
    }
  };

  const handleRemoveProject = async (projectId) => {
    try {
      await removeProject(projectId);
      setProjects((prev) => prev.filter((p) => p.id !== projectId));
    } catch (err) {
      console.error(err);
      alert("Cannot remove project: some tasks are incomplete");
    }
  };

  const handleFileUpload = async (taskId, file) => {
    setUploading((prev) => ({ ...prev, [taskId]: true }));
    await uploadTaskDocument(taskId, file);
    setUploading((prev) => ({ ...prev, [taskId]: false }));
    fetchProjects();
  };

  const shapes = [
    { top: "10%", left: "5%", size: "w-40 h-40", color: "bg-indigo-300", delay: "0s" },
    { top: "20%", left: "70%", size: "w-56 h-56", color: "bg-pink-300", delay: "1s" },
    { top: "60%", left: "30%", size: "w-32 h-32", color: "bg-purple-400", delay: "2s" },
  ];

  return (
    <div className={`min-h-screen relative overflow-hidden ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
      
      {/* NAVBAR */}
      <nav className="w-full bg-white dark:bg-gray-900 shadow-md fixed top-0 left-0 z-50 h-20">
  <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center h-full">
    {/* Logo */}
    <img
      src="/logowb.png"
      alt="Company Logo"
      className="h-35 w-45"
    />

    {/* Menu links */}
    <div className="hidden md:flex items-center gap-6">
      <Link
        href="/"
        className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
      >
        Home
      </Link>
      <Link
        href="/my-tasks"
        className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
      >
        My Tasks
      </Link>
    </div>

    {/* Dark mode toggle */}
    <button
      onClick={() => setDarkMode(!darkMode)}
      className="bg-indigo-600 text-white px-4 py-2 rounded-xl shadow-lg hover:bg-indigo-700 transition"
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>

    {/* Mobile menu button */}
    <button
      className="md:hidden text-gray-700 dark:text-gray-200 ml-2"
      onClick={() => setMenuOpen(!menuOpen)}
    >
      {menuOpen ? "✖" : "☰"}
    </button>
  </div>

  {/* Mobile Menu */}
  {menuOpen && (
    <div className="md:hidden px-6 pb-4 flex flex-col gap-4 bg-white dark:bg-gray-900">
      <Link
        href="/"
        className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
      >
        Home
      </Link>
      <Link
        href="/my-tasks"
        className="text-gray-700 dark:text-gray-200 hover:text-indigo-500 transition"
      >
        My Tasks
      </Link>
    </div>
  )}
</nav>
      {/* "My Tasks" Header below navbar */}
      <h1 className="text-5xl font-extrabold text-royalblue mt-24 mb-10 relative z-10 drop-shadow-lg text-center">
        My Tasks
      </h1>

      {/* Animated shapes */}
      {shapes.map((shape, index) => (
        <div
          key={index}
          className={`absolute ${shape.size} ${shape.color} rounded-full opacity-20 animate-scale`}
          style={{ top: shape.top, left: shape.left, animationDelay: shape.delay }}
        ></div>
      ))}

      {/* Projects */}
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {projects.map((project) => {
          const completedTasks = project.tasks.filter(
            (t) => t.status.toLowerCase() === "completed"
          ).length;
          const allCompleted = completedTasks === project.tasks.length;

          return (
            <div
              key={project.id}
              className={`border rounded-3xl px-10 py-8 mb-8 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:shadow-indigo-400 ${
                darkMode
                  ? "bg-gray-800 border-gray-700 text-white"
                  : "bg-white/90 border-gray-200 text-gray-900"
              }`}
            >
              <div
                className="flex justify-between items-start cursor-pointer"
                onClick={() => toggleExpand(project.id)}
              >
                <div className="flex-1">
                  <h2 className="text-2xl font-semibold">{project.name}</h2>
                  <p className="text-sm mt-1">Deadline: {project.deadline}</p>
                  <p className="text-sm mt-1">
                    Progress: {completedTasks}/{project.tasks.length} completed
                  </p>
                  <div className="w-full bg-gray-300 h-3 rounded mt-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-3 rounded transition-all duration-500"
                      style={{ width: `${(completedTasks / project.tasks.length) * 100}%` }}
                    ></div>
                  </div>
                </div>

                {allCompleted && (
                  <button
                    className="text-red-600 font-bold ml-4 hover:underline"
                    onClick={() => handleRemoveProject(project.id)}
                  >
                    Remove Project
                  </button>
                )}
              </div>

              {expanded[project.id] && (
                <div className="mt-6 pl-6 border-l border-gray-300">
                  {project.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="mb-4 p-4 rounded-xl bg-gray-100 dark:bg-gray-700 shadow-md flex justify-between items-center"
                    >
                      <div>
                        <p className="font-medium">
                          {task.description}{" "}
                          {task.requires_document && !task.document && (
                            <span className="text-red-500">(Document required)</span>
                          )}
                          {task.document && (
                            <span className="text-green-500">(Document uploaded)</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {task.status.toLowerCase() !== "completed" && (
                          <button
                            className="bg-green-500 text-white px-2 py-1 rounded"
                            onClick={() => handleMarkDone(task.id, project.id)}
                          >
                            Mark as Done
                          </button>
                        )}
                        {task.requires_document && !task.document && (
                          <input
                            type="file"
                            onChange={(e) => handleFileUpload(task.id, e.target.files[0])}
                            disabled={uploading[task.id]}
                            className="text-sm"
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @keyframes scaleAnim {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.5); }
        }
        .animate-scale {
          animation: scaleAnim 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
