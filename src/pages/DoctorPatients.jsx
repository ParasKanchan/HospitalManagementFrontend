import React, { useState, useEffect } from "react";
import { appointmentAPI, healthRecordAPI } from "../services/api";
import Loader from "../components/Loader";

const DoctorPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedPatient, setExpandedPatient] = useState(null);
  const [healthRecords, setHealthRecords] = useState({});
  const [loadingRecords, setLoadingRecords] = useState({});

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const response = await appointmentAPI.getDoctorPatients();
      setPatients(response.data.patients || []);
    } catch (err) {
      setError("Failed to load patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHealthRecords = async (patientId) => {
    try {
      setLoadingRecords((prev) => ({ ...prev, [patientId]: true }));
      const response = await healthRecordAPI.getPatientRecords(patientId);
      setHealthRecords((prev) => ({
        ...prev,
        [patientId]: response.data.records || [],
      }));
    } catch (err) {
      console.error("Failed to load health records:", err);
      setHealthRecords((prev) => ({ ...prev, [patientId]: [] }));
    } finally {
      setLoadingRecords((prev) => ({ ...prev, [patientId]: false }));
    }
  };

  const handleExpandPatient = (patientId) => {
    if (expandedPatient === patientId) {
      setExpandedPatient(null);
    } else {
      setExpandedPatient(patientId);
      // Fetch health records when expanding if not already fetched
      if (!healthRecords[patientId]) {
        fetchHealthRecords(patientId);
      }
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-2">My Patients</h2>
      <p className="text-gray-600 mb-6">
        Total Patients: {patients.length}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="space-y-4">
        {patients.length === 0 ? (
          <p className="text-gray-600">No patients yet.</p>
        ) : (
          patients.map((patient) => (
            <div key={patient._id} className="bg-white shadow rounded p-4">
              <div
                className="flex justify-between items-start cursor-pointer"
                onClick={() => handleExpandPatient(patient._id)}
              >
                <div className="flex-grow">
                  <p className="font-semibold text-lg">{patient.name}</p>
                  <p className="text-sm text-gray-600">Email: {patient.email}</p>
                  {patient.phone && (
                    <p className="text-sm text-gray-600">Phone: {patient.phone}</p>
                  )}
                  {patient.age && (
                    <p className="text-sm text-gray-600">Age: {patient.age}</p>
                  )}
                  {patient.gender && (
                    <p className="text-sm text-gray-600">
                      Gender: {patient.gender}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="font-semibold text-blue-600">
                    {patient.appointments.length} Appointment
                    {patient.appointments.length !== 1 ? "s" : ""}
                  </p>
                  <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    {expandedPatient === patient._id ? "▼ Hide" : "▶ Show"}
                  </button>
                </div>
              </div>

              {expandedPatient === patient._id && (
                <div className="mt-4 border-t pt-4">
                  {/* Appointments Section */}
                  <h4 className="font-semibold mb-3">Appointments</h4>
                  <div className="space-y-3 mb-6">
                    {patient.appointments.map((apt) => (
                      <div
                        key={apt._id}
                        className="bg-gray-50 p-3 rounded border border-gray-200"
                      >
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Date:</span>{" "}
                              {new Date(apt.date).toLocaleDateString()}
                            </p>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Time:</span>{" "}
                              {apt.time}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-semibold">Department:</span>{" "}
                              {apt.department}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Status:</span>{" "}
                              <span
                                className={`${
                                  apt.status === "completed"
                                    ? "text-green-600"
                                    : apt.status === "cancelled"
                                    ? "text-red-600"
                                    : apt.status === "confirmed"
                                    ? "text-blue-600"
                                    : "text-yellow-600"
                                }`}
                              >
                                {apt.status}
                              </span>
                            </p>
                          </div>
                        </div>
                        {apt.notes && (
                          <p className="text-sm text-gray-600 mt-2">
                            <span className="font-semibold">Notes:</span>{" "}
                            {apt.notes}
                          </p>
                        )}

                        {/* Health Information Submitted with Appointment */}
                        {(apt.weight || apt.bloodPressure || apt.sugarLevel || apt.heartRate || apt.sleepHours || apt.stepsWalked || apt.activeTime) && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-sm font-semibold text-green-900 mb-2">Health Info Submitted:</p>
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

                        {/* Health Information Submitted with Appointment */}
                        {(apt.weight || apt.bloodPressure || apt.sugarLevel || apt.heartRate || apt.sleepHours || apt.stepsWalked || apt.activeTime) && (
                          <div className="mt-3 pt-3 border-t border-gray-300">
                            <p className="text-sm font-semibold text-green-900 mb-2">Health Info Submitted:</p>
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
                    ))}
                  </div>

                  {/* Health Records Section */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-3">Wellness Tracker</h4>
                    {loadingRecords[patient._id] ? (
                      <p className="text-gray-600 text-sm">Loading health records...</p>
                    ) : (healthRecords[patient._id] || []).length === 0 ? (
                      <p className="text-gray-600 text-sm">No health records available.</p>
                    ) : (
                      <div className="space-y-3">
                        {(healthRecords[patient._id] || []).map((record) => (
                          <div
                            key={record._id}
                            className="bg-blue-50 p-3 rounded border border-blue-200"
                          >
                            <p className="text-sm font-semibold text-blue-900 mb-2">
                              {new Date(record.date).toLocaleDateString()} -{" "}
                              {new Date(record.date).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              {record.weight && (
                                <div className="text-gray-700">
                                  <span className="font-semibold">Weight:</span> {record.weight} kg
                                </div>
                              )}
                              {record.bloodPressure && (
                                <div className="text-gray-700">
                                  <span className="font-semibold">BP:</span> {record.bloodPressure} mmHg
                                </div>
                              )}
                              {record.sugarLevel && (
                                <div className="text-gray-700">
                                  <span className="font-semibold">Sugar Level:</span> {record.sugarLevel} mg/dL
                                </div>
                              )}
                              {record.heartRate && (
                                <div className="text-gray-700">
                                  <span className="font-semibold">Heart Rate:</span> {record.heartRate} bpm
                                </div>
                              )}
                              {record.sleepHours && (
                                <div className="text-gray-700">
                                  <span className="font-semibold">Sleep:</span> {record.sleepHours} hours
                                </div>
                              )}
                              {record.stepsWalked && (
                                <div className="text-gray-700">
                                  <span className="font-semibold">Steps:</span> {record.stepsWalked}
                                </div>
                              )}
                              {record.activeTime && (
                                <div className="text-gray-700">
                                  <span className="font-semibold">Active Time:</span> {record.activeTime} mins
                                </div>
                              )}
                            </div>
                            {record.notes && (
                              <p className="text-sm text-gray-600 mt-2">
                                <span className="font-semibold">Notes:</span> {record.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DoctorPatients;
