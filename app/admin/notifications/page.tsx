

"use client";

import { useEffect, useState } from "react";
import type { NotificationItem } from "@/app/notification/notification-types";

const emptyForm = {
  title: "",
  description: "",
  category: "announcements",
  badge: "",
  actionLabel: "",
  actionHref: "",
};

async function readApiResponse(response: Response) {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      error: text || `Empty response. HTTP ${response.status}`,
    };
  }
}
export default function AdminNotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [formError, setFormError] = useState("");

  const [formData, setFormData] = useState(emptyForm);

  // Fetch notifications
  useEffect(() => {
    async function fetchNotifications() {
      try {
        const response = await fetch("/api/admin/notifications");

        if (!response.ok) {
          throw new Error("Failed to fetch notifications");
        }

        const data = await readApiResponse(response);
        setNotifications(data.notifications);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Something went wrong"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  // Create or update notification
  async function handleSubmitNotification(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");

    try {
      const isEditing = editingId !== null;

      const response = await fetch("/api/admin/notifications", {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          ...(isEditing ? { id: editingId } : {}),
        }),
      });

      const data = await readApiResponse(response);
      
      console.log("DELETE status:", response.status);
      console.log("DELETE response:", data);
      
      if (!response.ok) {
        throw new Error(
          data.error || "Failed to save notification"
        );
      }

      if (isEditing) {
        setNotifications((prev) =>
          prev.map((item) =>
            item.id === editingId ? data.notification : item
          )
        );
      } else {
        setNotifications((prev) => [
          data.notification,
          ...prev,
        ]);
      }

      closeForm();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSubmitting(false);
    }
  }

  // Open form for editing
  function handleEdit(item: NotificationItem) {
    setEditingId(item.id);

    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      badge: item.badge,
      actionLabel: item.action?.label || "",
      actionHref: item.action?.href || "",
    });

    setFormError("");
    setShowForm(true);
  }

  // Close and reset form
  function closeForm() {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFormError("");
  }

  // Delete notification
  async function handleDelete(id: string) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this notification?"
    );

    if (!confirmed) return;

    setDeletingId(id);
    setError("");

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const data = await readApiResponse(response);

      if (!response.ok) {
        throw new Error(
          data.error || "Failed to delete notification"
        );
      }

      setNotifications((prev) =>
        prev.filter((item) => item.id !== id)
      );

      if (editingId === id) {
        closeForm();
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <main className="min-h-screen bg-black p-6 text-white md:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Dashboard heading */}
        <h1 className="text-3xl font-bold">
          Notification Management
        </h1>

        <p className="mt-2 text-gray-400">
          Manage your Open Engineering notifications.
        </p>

        {/* Create notification section */}
        <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-6">

          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              {editingId ? "Edit Notification" : "Create Notification"}
            </h2>

            <button
              type="button"
              onClick={() => {
                if (showForm) {
                  closeForm();
                } else {
                  setEditingId(null);
                  setFormData(emptyForm);
                  setShowForm(true);
                  setFormError("");
                }
              }}
              className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-black"
            >
              {showForm ? "Cancel" : "+ New Notification"}
            </button>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmitNotification}
              className="mt-6 space-y-5"
            >
              {/* Title */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Title
                </label>

                <input
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      title: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-black p-3 text-white"
                  placeholder="Enter notification title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="mb-2 block text-sm text-gray-300">
                  Description
                </label>

                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      description: e.target.value,
                    })
                  }
                  className="w-full rounded-lg border border-white/10 bg-black p-3 text-white"
                  placeholder="Enter notification description"
                />
              </div>

              {/* Category and Badge */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Category
                  </label>

                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-black p-3 text-white"
                  >
                    <option value="products">Products</option>
                    <option value="announcements">Announcements</option>
                    <option value="system">System</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Badge
                  </label>

                  <input
                    required
                    value={formData.badge}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        badge: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-black p-3 text-white"
                    placeholder="e.g. Product Update"
                  />
                </div>
              </div>

              {/* Action button */}
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Action Button Label (Optional)
                  </label>

                  <input
                    value={formData.actionLabel}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actionLabel: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-black p-3 text-white"
                    placeholder="e.g. Explore Products"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm text-gray-300">
                    Action URL (Optional)
                  </label>

                  <input
                    value={formData.actionHref}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        actionHref: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-white/10 bg-black p-3 text-white"
                    placeholder="/products"
                  />
                </div>
              </div>

              {/* Error */}
              {formError && (
                <p className="text-sm text-red-400">
                  {formError}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={submitting}
                className="rounded-lg bg-white px-6 py-3 font-medium text-black disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Notification"}
              </button>
            </form>
          )}
        </div>

        {/* Notification list */}
        <div className="mt-10">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-xl font-semibold">
              All Notifications
            </h2>

            <span className="rounded-lg bg-white/10 px-3 py-1 text-sm">
              {notifications.length} total
            </span>
          </div>

          {loading && (
            <p className="text-gray-400">
              Loading notifications...
            </p>
          )}

          {error && (
            <p className="text-red-400">{error}</p>
          )}

          {!loading && !error && notifications.length === 0 && (
            <p className="text-gray-400">
              No notifications found.
            </p>
          )}

          <div className="space-y-4">
            {notifications.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-white/10 bg-white/[0.04] p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold">
                    {item.title}
                  </h3>

                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-300">
                    {item.category}
                  </span>
                </div>

                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {item.description}
                </p>

                <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                  <span>{item.time}</span>
                  <span>{item.read ? "Read" : "Unread"}</span>
                  <span>{item.badge}</span>
                </div>

                {/* Edit and Delete */}
                <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
                  <button
                    type="button"
                    onClick={() => handleEdit(item)}
                    disabled={deletingId !== null || submitting}
                    className="rounded-lg border border-white/20 px-4 py-2 text-sm text-white hover:bg-white/10 disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={deletingId !== null || submitting}
                    className="rounded-lg border border-red-500/30 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {deletingId === item.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}
