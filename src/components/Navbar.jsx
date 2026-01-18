import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => {
    return location.pathname === path ? "bg-blue-700 rounded px-3 py-2" : "px-3 py-2";
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow">
      <Link to="/" className="text-2xl font-bold hover:text-gray-200">
        HealthCare
      </Link>

      <div className="space-x-2 flex items-center">
        {isAuthenticated && user ? (
          <>
            <Link to="/dashboard" className={`hover:text-gray-200 transition ${isActive("/dashboard")}`}>
              Dashboard
            </Link>
            {user.role === "patient" ? (
              <>
                <Link to="/appointments" className={`hover:text-gray-200 transition ${isActive("/appointments")}`}>
                  Appointments
                </Link>
                <Link to="/wellness" className={`hover:text-gray-200 transition ${isActive("/wellness")}`}>
                  Wellness
                </Link>
              </>
            ) : null}
            <Link to="/tips" className={`hover:text-gray-200 transition ${isActive("/tips")}`}>
              Tips
            </Link>
            <Link to="/profile" className={`hover:text-gray-200 transition flex items-center gap-2 ${isActive("/profile")}`}>
              <span className="text-xl">👤</span>
              <span className="text-sm">
                {user.role === "doctor" ? "Dr. " : ""}{user.name}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className={`hover:text-gray-200 transition ${isActive("/login")}`}>
              Login
            </Link>
            <Link to="/register" className={`hover:text-gray-200 transition ${isActive("/register")}`}>
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
