import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Appointments from "./pages/Appointments";
import WellnessTracker from "./pages/WellnessTracker";
import HealthTips from "./pages/HealthTips";
import DoctorPatients from "./pages/DoctorPatients";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

function App() {
  useEffect(() => {
    // Disable console in production to prevent password exposure in devtools
    if (process.env.NODE_ENV === "production") {
      console.log = () => {};
      console.error = () => {};
      console.warn = () => {};
      console.info = () => {};
      console.debug = () => {};
      
      // Prevent console access via devtools
      (function() {
        let devtools = { open: false, orientation: null };
        const threshold = 160;
        setInterval(function() {
          if (window.outerHeight - window.innerHeight > threshold || 
              window.outerWidth - window.innerWidth > threshold) {
            if (!devtools.open) {
              devtools.open = true;
            }
          } else {
            if (devtools.open) {
              devtools.open = false;
            }
          }
        }, 500);
      })();
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow bg-gray-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/wellness" element={<WellnessTracker />} />
            <Route path="/patients" element={<DoctorPatients />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="/tips" element={<HealthTips />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
