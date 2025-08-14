"use client";

import { useEffect, useMemo, useState } from "react";
import { getMyTasks, updateTaskStatus, deleteTask } from "@/lib/api"; // make sure deleteTask is defined

export default function MyTasksPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null); // taskId while updating
  const [error, setError] = useState("");

  const reload = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getMyTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reload();
  }, []);

  const completedCount = useMemo(
    () => tasks.filter((t) => t.status === "Completed").length,
    [tasks]
  );
  const progress = useMemo(
    () => (tasks.length ? Math.round((completedCount / tasks.length) * 100) : 0),
    [tasks, completedCount]
  );

  const markCompleted = async (taskId) => {
    if (!confirm("Mark this task as Completed?")) return;
    try {
      setUpdating(taskId);
      await updateTaskStatus(taskId, "Completed");
      await reload();
    } catch (e) {
      console.error(e);
      alert("Failed to update task status");
    } finally {
      setUpdating(null);
    }
  };

  const removeTask = async (taskId) => {
    if (!confirm("Remove this completed task?")) return;
    try {
      setUpdating(taskId);
      await deleteTask(taskId); // make sure deleteTask sends DELETE to /tasks/<id>/
      await reload();
    } catch (e) {
      console.error(e);
      alert("Failed to remove task");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Tasks</h1>

      {error && <div className="mb-4 bg-red-100 text-red-700 p-2 rounded">{error}</div>}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm text-gray-600">
            Progress: {completedCount}/{tasks.length} completed
          </span>
          <span className="text-sm font-semibold">{progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className="h-3 rounded-full bg-green-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {loading ? (
        <p>Loading…</p>
      ) : tasks.length === 0 ? (
        <p className="text-gray-600">No tasks assigned yet.</p>
      ) : (
        <ul className="space-y-3">
          {tasks.map((t) => (
            <li key={t.id} className="border rounded-xl p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-medium">{t.description}</p>
                  {t.project?.name && (
                    <p className="text-sm text-gray-500 mt-1">
                      Project: {t.project.name}
                    </p>
                  )}
                  <p className="text-sm mt-1">
                    Status:{" "}
                    <span
                      className={
                        t.status === "Completed"
                          ? "text-green-600"
                          : t.status === "In Progress"
                          ? "text-yellow-600"
                          : "text-gray-700"
                      }
                    >
                      {t.status}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {t.status !== "Completed" && (
                    <button
                      disabled={updating === t.id}
                      onClick={() => markCompleted(t.id)}
                      className="px-3 py-1 rounded bg-blue-600 text-white disabled:opacity-60"
                    >
                      {updating === t.id ? "Saving…" : "Mark Completed"}
                    </button>
                  )}

                  {t.status === "Completed" && (
                    <button
                      disabled={updating === t.id}
                      onClick={() => removeTask(t.id)}
                      className="px-3 py-1 rounded bg-red-600 text-white disabled:opacity-60"
                    >
                      {updating === t.id ? "Removing…" : "Remove"}
                    </button>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
