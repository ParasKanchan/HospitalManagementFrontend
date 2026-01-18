import React, { useState, useEffect } from "react";
import { healthRecordAPI } from "../services/api";
import Loader from "../components/Loader";

const WellnessTracker = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    weight: "",
    bloodPressure: "",
    sugarLevel: "",
    heartRate: "",
    sleepHours: "",
    stepsWalked: "",
    activeTime: "",
    notes: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchRecords();
  }, []);

  const fetchRecords = async () => {
    try {
      setLoading(true);
      const response = await healthRecordAPI.getMyRecords();
      setRecords(response.data.records || []);
    } catch (err) {
      setError("Failed to load health records");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await healthRecordAPI.add(formData);
      setFormData({
        weight: "",
        bloodPressure: "",
        sugarLevel: "",
        heartRate: "",
        sleepHours: "",
        stepsWalked: "",
        activeTime: "",
        notes: "",
      });
      setShowForm(false);
      fetchRecords();
    } catch (err) {
      setError("Failed to add health record");
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      try {
        await healthRecordAPI.delete(id);
        fetchRecords();
      } catch (err) {
        setError("Failed to delete record");
        console.error(err);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Wellness Tracker</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {showForm ? "Cancel" : "Add Health Record"}
      </button>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded shadow mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                className="w-full border border-gray-300 p-2 rounded"
                value={formData.weight}
                onChange={(e) =>
                  setFormData({ ...formData, weight: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Blood Pressure
              </label>
              <input
                type="text"
                placeholder="e.g., 120/80"
                className="w-full border border-gray-300 p-2 rounded"
                value={formData.bloodPressure}
                onChange={(e) =>
                  setFormData({ ...formData, bloodPressure: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Sugar Level
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 p-2 rounded"
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
                value={formData.activeTime}
                onChange={(e) =>
                  setFormData({ ...formData, activeTime: e.target.value })
                }
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-gray-700 font-medium mb-2">
              Notes
            </label>
            <textarea
              className="w-full border border-gray-300 p-2 rounded"
              rows="3"
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
            />
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add Record
          </button>
        </form>
      )}

      <div className="space-y-4">
        {records.length === 0 ? (
          <p className="text-gray-600">No health records yet.</p>
        ) : (
          records.map((record) => (
            <div key={record._id} className="bg-white shadow rounded p-4">
              <div className="flex justify-between items-start">
                <div className="grid grid-cols-2 gap-4 flex-grow">
                  {record.weight && (
                    <p className="text-sm">
                      <span className="font-semibold">Weight:</span>{" "}
                      {record.weight} kg
                    </p>
                  )}
                  {record.bloodPressure && (
                    <p className="text-sm">
                      <span className="font-semibold">BP:</span>{" "}
                      {record.bloodPressure}
                    </p>
                  )}
                  {record.sugarLevel && (
                    <p className="text-sm">
                      <span className="font-semibold">Sugar Level:</span>{" "}
                      {record.sugarLevel}
                    </p>
                  )}
                  {record.heartRate && (
                    <p className="text-sm">
                      <span className="font-semibold">Heart Rate:</span>{" "}
                      {record.heartRate} bpm
                    </p>
                  )}
                  {record.sleepHours && (
                    <p className="text-sm">
                      <span className="font-semibold">Sleep:</span>{" "}
                      {record.sleepHours} hrs
                    </p>
                  )}
                  {record.stepsWalked && (
                    <p className="text-sm">
                      <span className="font-semibold">Steps:</span>{" "}
                      {record.stepsWalked}
                    </p>
                  )}
                  {record.activeTime && (
                    <p className="text-sm">
                      <span className="font-semibold">Active Time:</span>{" "}
                      {record.activeTime} mins
                    </p>
                  )}
                </div>
                <button
                  onClick={() => handleDelete(record._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </div>
              {record.notes && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Notes:</span> {record.notes}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {new Date(record.createdAt).toLocaleString()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default WellnessTracker;
  