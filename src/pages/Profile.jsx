import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    age: user?.age || "",
    gender: user?.gender || "",
    location: user?.location || "",
    address: user?.address || "",
    bloodType: user?.bloodType || "",
    bio: user?.bio || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    // In a real app, you'd make an API call to update user data
    console.log("Profile updated:", formData);
    setIsEditing(false);
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-8 pb-6 border-b">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {isEditing ? (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded text-center text-3xl"
              />
            ) : (
              <>
                {user.role === "doctor" ? "Dr. " : ""}{user.name}
              </>
            )}
          </h1>
          <p className="text-lg text-gray-600 capitalize">
            {user.role === "doctor" ? "Healthcare Provider" : "Patient"}
          </p>
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Personal Information</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`px-4 py-2 rounded transition ${
                isEditing
                  ? "bg-red-500 hover:bg-red-600 text-white"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Email</h3>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded text-gray-600"
                />
              ) : (
                <p className="text-gray-600">{user.email}</p>
              )}
            </div>

            {/* Role */}
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-2">Role</h3>
              <p className="text-gray-600 capitalize">
                {user.role === "doctor" ? "Doctor" : "Patient"}
              </p>
            </div>

            {/* Phone */}
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-2">📞 Phone</h3>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter phone number"
                />
              ) : (
                <p className="text-gray-600">{user.phone || "Not provided"}</p>
              )}
            </div>

            {/* Age */}
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-2">🎂 Age</h3>
              {isEditing ? (
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter age"
                />
              ) : (
                <p className="text-gray-600">{user.age || "Not provided"}</p>
              )}
            </div>

            {/* Gender */}
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-2">⚧️ Gender</h3>
              {isEditing ? (
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              ) : (
                <p className="text-gray-600">{user.gender ? user.gender.charAt(0).toUpperCase() + user.gender.slice(1) : "Not provided"}</p>
              )}
            </div>

            {/* Blood Type */}
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-2">🩸 Blood Type</h3>
              {isEditing ? (
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                >
                  <option value="">Select Blood Type</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                </select>
              ) : (
                <p className="text-gray-600">{user.bloodType || "Not provided"}</p>
              )}
            </div>

            {/* Location */}
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-2">📍 Location</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter city/region"
                />
              ) : (
                <p className="text-gray-600">{user.location || "Not provided"}</p>
              )}
            </div>

            {/* Address */}
            <div className="border border-gray-300 rounded p-4">
              <h3 className="font-semibold text-gray-700 mb-2">🏠 Address</h3>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter address"
                />
              ) : (
                <p className="text-gray-600">{user.address || "Not provided"}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="mt-6 border border-gray-300 rounded p-4">
            <h3 className="font-semibold text-gray-700 mb-2">📝 Bio</h3>
            {isEditing ? (
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded"
                rows="4"
                placeholder="Write something about yourself..."
              />
            ) : (
              <p className="text-gray-600">{user.bio || "No bio added yet"}</p>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-gray-700 mb-3">Account Information</h3>
          <p className="text-sm text-gray-600 mb-2">
            <span className="font-semibold">User ID:</span> {user._id}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-semibold">Member since:</span> {new Date(user.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          {isEditing && (
            <button
              onClick={handleSave}
              className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
            >
              Save Changes
            </button>
          )}
          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
