import React, { useState, useEffect } from "react";
import { appointmentAPI } from "../services/api";
import { authAPI } from "../services/api";
import Loader from "../components/Loader";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    doctorName: "",
    appointmentDate: "",
    timeSlot: "",
    department: "general",
    notes: "",
    weight: "",
    bloodPressure: "",
    sugarLevel: "",
    heartRate: "",
    sleepHours: "",
    stepsWalked: "",
    activeTime: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getMyAppointments();
      setAppointments(response.data.appointments || []);
    } catch (err) {
      setError("Failed to load appointments");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await authAPI.getDoctors();
      setDoctors(response.data.doctors || []);
    } catch (err) {
      console.error("Failed to load doctors:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appointmentAPI.create(formData);
      setFormData({ 
        doctorName: "", 
        appointmentDate: "", 
        timeSlot: "", 
        department: "general", 
        notes: "",
        weight: "",
        bloodPressure: "",
        sugarLevel: "",
        heartRate: "",
        sleepHours: "",
        stepsWalked: "",
        activeTime: "",
      });
      setShowForm(false);
      fetchAppointments();
    } catch (err) {
      setError("Failed to create appointment");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      try {
        await appointmentAPI.delete(id);
        fetchAppointments();
      } catch (err) {
        setError("Failed to delete appointment");
        console.error(err);
      }
    }
  };

  const handleMarkReminderSeen = async (id) => {
    try {
      await appointmentAPI.markReminderSent(id);
      fetchAppointments();
    } catch (err) {
      setError("Failed to mark reminder as seen");
      console.error(err);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">My Appointments</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "Book Appointment"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Select Doctor
            </label>
            {doctors.length === 0 ? (
              <p className="text-gray-600 text-sm">No doctors available</p>
            ) : (
              <select
                className="w-full border border-gray-300 p-2 rounded"
                value={formData.doctorName}
                onChange={(e) =>
                  setFormData({ ...formData, doctorName: e.target.value })
                }
                required
              >
                <option value="">-- Select a Doctor --</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor.name}>
                    Dr. {doctor.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Appointment Date
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.appointmentDate}
              onChange={(e) =>
                setFormData({ ...formData, appointmentDate: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Time Slot
            </label>
            <input
              type="time"
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.timeSlot}
              onChange={(e) =>
                setFormData({ ...formData, timeSlot: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Department
            </label>
            <select
              className="w-full border border-gray-300 p-2 rounded"
              value={formData.department}
              onChange={(e) =>
                setFormData({ ...formData, department: e.target.value })
              }
            >
              <option value="general">General</option>
              <option value="cardiology">Cardiology</option>
              <option value="dentistry">Dentistry</option>
              <option value="dermatology">Dermatology</option>
              <option value="orthopedic">Orthopedic</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Notes
            </label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
              placeholder="Any additional notes or symptoms"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          {/* Wellness Tracker Fields */}
          <div className="mb-4 border-t pt-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Health Information (Optional)</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter weight"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="e.g., 120/80"
                  value={formData.bloodPressure}
                  onChange={(e) =>
                    setFormData({ ...formData, bloodPressure: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Sugar Level (mg/dL)
                </label>
                <input
                  type="number"
                  step="0.1"
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter sugar level"
                  value={formData.sugarLevel}
                  onChange={(e) =>
                    setFormData({ ...formData, sugarLevel: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter heart rate"
                  value={formData.heartRate}
                  onChange={(e) =>
                    setFormData({ ...formData, heartRate: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Sleep Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter sleep hours"
                  value={formData.sleepHours}
                  onChange={(e) =>
                    setFormData({ ...formData, sleepHours: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Steps Walked
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter steps"
                  value={formData.stepsWalked}
                  onChange={(e) =>
                    setFormData({ ...formData, stepsWalked: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Active Time (minutes)
                </label>
                <input
                  type="number"
                  className="w-full border border-gray-300 p-2 rounded"
                  placeholder="Enter active time"
                  value={formData.activeTime}
                  onChange={(e) =>
                    setFormData({ ...formData, activeTime: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Book Appointment
          </button>
        </form>
      )}

      <div className="space-y-4">
        {appointments.length === 0 ? (
          <p className="text-gray-600">No appointments yet.</p>
        ) : (
          appointments.map((apt) => (
            <div key={apt._id} className="bg-white shadow rounded p-4">
              {apt.reminderNeeded && !apt.reminderSent && (
                <div
                  className={`mb-4 p-3 border rounded flex justify-between items-center ${
                    apt.reminderType === "12-hour"
                      ? "bg-red-100 border-red-400 text-red-700"
                      : "bg-yellow-100 border-yellow-400 text-yellow-700"
                  }`}
                >
                  <span className="font-semibold">
                    {apt.reminderType === "12-hour"
                      ? "⏰ Urgent: Your appointment is in 12 hours!"
                      : "📅 Reminder: Your appointment is tomorrow!"}
                  </span>
                  <button
                    onClick={() => handleMarkReminderSeen(apt._id)}
                    className={`text-sm px-3 py-1 rounded text-white ${
                      apt.reminderType === "12-hour"
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    }`}
                  >
                    Dismiss
                  </button>
                </div>
              )}
              <div className="flex justify-between items-start">
                <div className="flex-grow">
                  <p className="font-semibold text-lg">Dr. {apt.doctorName}</p>
                  <p className="text-sm text-gray-600">
                    Department: {apt.department || "General"}
                  </p>
                  <p className="text-sm text-gray-600">
                    Date: {new Date(apt.appointmentDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-gray-600">Time: {apt.timeSlot}</p>
                  {apt.notes && (
                    <p className="text-sm text-gray-600 mt-2">Notes: {apt.notes}</p>
                  )}
                  <p className="text-sm font-medium mt-2">
                    Status:{" "}
                    <span
                      className={`${
                        apt.status === "completed"
                          ? "text-green-600"
                          : apt.status === "cancelled"
                          ? "text-red-600"
                          : "text-yellow-600"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </p>

                  {/* Health Information Display */}
                  {(apt.weight || apt.bloodPressure || apt.sugarLevel || apt.heartRate || apt.sleepHours || apt.stepsWalked || apt.activeTime) && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="font-semibold text-sm text-blue-900 mb-2">Health Information:</p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        {apt.weight && (
                          <div className="text-gray-700">
                            <span className="font-semibold">Weight:</span> {apt.weight} kg
                          </div>
                        )}
                        {apt.bloodPressure && (
                          <div className="text-gray-700">
                            <span className="font-semibold">BP:</span> {apt.bloodPressure} mmHg
                          </div>
                        )}
                        {apt.sugarLevel && (
                          <div className="text-gray-700">
                            <span className="font-semibold">Sugar Level:</span> {apt.sugarLevel} mg/dL
                          </div>
                        )}
                        {apt.heartRate && (
                          <div className="text-gray-700">
                            <span className="font-semibold">Heart Rate:</span> {apt.heartRate} bpm
                          </div>
                        )}
                        {apt.sleepHours && (
                          <div className="text-gray-700">
                            <span className="font-semibold">Sleep:</span> {apt.sleepHours} hours
                          </div>
                        )}
                        {apt.stepsWalked && (
                          <div className="text-gray-700">
                            <span className="font-semibold">Steps:</span> {apt.stepsWalked}
                          </div>
                        )}
                        {apt.activeTime && (
                          <div className="text-gray-700">
                            <span className="font-semibold">Active Time:</span> {apt.activeTime} mins
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(apt._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Appointments;
  