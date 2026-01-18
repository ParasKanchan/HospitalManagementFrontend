import React, { useEffect, useState } from "react";
import { blogAPI } from "../services/api";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

const HealthTips = () => {
  const { user } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "general",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await blogAPI.getAll();
      setBlogs(response.data.blogs || []);
    } catch (err) {
      setError("Failed to load health tips");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);
      await blogAPI.create(formData);
      setFormData({ title: "", content: "", category: "general" });
      setShowForm(false);
      setError("");
      fetchBlogs();
    } catch (err) {
      setError("Failed to create health tip");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Health Tips & Articles</h2>
        {user?.role === "doctor" && (
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showForm ? "Cancel" : "+ Add New Tip"}
          </button>
        )}
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Form for doctors to add tips */}
      {showForm && user?.role === "doctor" && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6 border border-green-200"
        >
          <h3 className="text-2xl font-semibold mb-4">Add Health Tip</h3>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Title
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 p-2 rounded"
              placeholder="Enter tip title (e.g., Benefits of Exercise)"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Content
            </label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              rows="6"
              placeholder="Write detailed health information or tip..."
              value={formData.content}
              onChange={(e) =>
                setFormData({ ...formData, content: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Category
            </label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="general">General Health</option>
              <option value="nutrition">Nutrition</option>
              <option value="fitness">Fitness</option>
              <option value="mental-health">Mental Health</option>
              <option value="disease-prevention">Disease Prevention</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:bg-gray-400"
          >
            {submitting ? "Publishing..." : "Publish Tip"}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {blogs.length === 0 ? (
          <div className="bg-blue-50 p-8 rounded-lg text-center">
            <p className="text-gray-600 mb-2">No health tips available yet.</p>
            {user?.role === "doctor" && (
              <p className="text-sm text-gray-500">
                Be the first to share health tips with the community!
              </p>
            )}
          </div>
        ) : (
          blogs.map((blog) => (
            <div key={blog._id} className="bg-white shadow rounded p-6 hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">
                    {blog.title}
                  </h3>
                  <p className="text-gray-700 mb-4">{blog.content}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div>
                      {blog.category && (
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full mr-3">
                          {blog.category}
                        </span>
                      )}
                      <span>
                        {new Date(blog.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {blog.author && (
                      <span className="font-medium">
                        By Dr. {blog.author.fullName || "Health Expert"}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HealthTips;
