import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">Dashboard</h2>
      {user && (
        <p className="text-gray-600 mb-6">
          Welcome back, {user.role === "doctor" ? "Dr. " : ""}{user.name}! {user.role === "doctor" ? "👨‍⚕️" : "👤"}
        </p>
      )}

      {user?.role === "doctor" ? (
        // Doctor Dashboard
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            to="/patients"
            className="bg-blue-100 p-6 rounded shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="font-semibold text-lg">My Patients</h3>
            <p className="text-gray-600">View patient information & appointments</p>
          </Link>

          <Link
            to="/tips"
            className="bg-purple-100 p-6 rounded shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="font-semibold text-lg">Health Tips</h3>
            <p className="text-gray-600">Create & manage health tips</p>
          </Link>
        </div>
      ) : (
        // Patient Dashboard
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            to="/appointments"
            className="bg-green-100 p-6 rounded shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="font-semibold text-lg">Appointments</h3>
            <p className="text-gray-600">View & manage appointments</p>
          </Link>

          <Link
            to="/wellness"
            className="bg-blue-100 p-6 rounded shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="font-semibold text-lg">Wellness Tracker</h3>
            <p className="text-gray-600">Track health vitals</p>
          </Link>

          <Link
            to="/tips"
            className="bg-purple-100 p-6 rounded shadow hover:shadow-lg transition cursor-pointer"
          >
            <h3 className="font-semibold text-lg">Health Tips</h3>
            <p className="text-gray-600">Daily wellness tips</p>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
  