import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { blogAPI } from "../services/api";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [blogs, setBlogs] = useState([]);
  const [loadingBlogs, setLoadingBlogs] = useState(false);

  // Default health tips when no blogs exist
  const defaultTips = [
    {
      _id: "1",
      title: "Stay Hydrated",
      content: "Drinking at least 8 glasses of water daily helps maintain proper hydration, improves skin health, and supports kidney function.",
      isDefault: true,
    },
    {
      _id: "2",
      title: "Regular Exercise",
      content: "Aim for at least 150 minutes of moderate-intensity aerobic activity per week. Exercise reduces risk of chronic diseases and improves mental health.",
      isDefault: true,
    },
    {
      _id: "3",
      title: "Balanced Diet",
      content: "Include plenty of fruits, vegetables, whole grains, and lean proteins. A balanced diet provides essential nutrients for optimal health and immunity.",
      isDefault: true,
    },
  ];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoadingBlogs(true);
      const response = await blogAPI.getAll();
      const fetchedBlogs = response.data.blogs || [];
      // Show fetched blogs if available, otherwise show default tips
      setBlogs(fetchedBlogs.length > 0 ? fetchedBlogs.slice(0, 3) : defaultTips);
    } catch (err) {
      console.error("Failed to load blogs:", err);
      setBlogs(defaultTips);
    } finally {
      setLoadingBlogs(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-12 text-center">
        <h1 className="text-5xl font-bold mb-4">Healthcare Wellness Portal</h1>
        <p className="text-xl mb-8">
          Track your health, book appointments & stay fit.
        </p>
        {!isAuthenticated ? (
          <div className="space-x-4">
            <Link
              to="/login"
              className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded font-semibold hover:bg-white hover:text-blue-600"
            >
              Register
            </Link>
          </div>
        ) : (
          <Link
            to="/dashboard"
            className="bg-white text-blue-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
          >
            Go to Dashboard
          </Link>
        )}
      </div>

      {/* Features Section */}
      <div className="p-12 max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-xl font-semibold mb-3">Book Appointments</h3>
            <p className="text-gray-700">
              Easy scheduling with healthcare providers
            </p>
          </div>
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-semibold mb-3">Wellness Tracker</h3>
            <p className="text-gray-700">
              Monitor your health vitals and progress
            </p>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <h3 className="text-xl font-semibold mb-3">Health Tips</h3>
            <p className="text-gray-700">
              Get daily wellness tips and health articles
            </p>
          </div>
        </div>
      </div>

      {/* Disease Information Section */}
      <div className="bg-gray-50 p-12">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-2">Disease & Health Information</h2>
          <p className="text-center text-gray-600 mb-8">
            Learn about common diseases, prevention tips, and wellness advice
          </p>

          {loadingBlogs ? (
            <div className="text-center text-gray-600">Loading health information...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogs.map((blog) => (
                <div
                  key={blog._id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-2"></div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3 line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {blog.content}
                    </p>
                    <div className="flex justify-between items-center text-xs text-gray-500">
                      {!blog.isDefault && blog.createdAt && (
                        <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                      )}
                      {blog.isDefault && <span className="text-blue-600 font-semibold">Health Tip</span>}
                      {blog.author && (
                        <span>By {blog.author.fullName || "Health Expert"}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              to="/tips"
              className="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700"
            >
              View All Health Tips
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
  