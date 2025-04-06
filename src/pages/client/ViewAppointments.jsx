import React, { useEffect, useState, useRef } from "react";
import { useToast } from "../../context/ToastContext";
import axios from "../../utils/axiosInstance"; // Adjust the import path as necessary
import { API_ENDPOINTS } from "../../config/config";
import { useAuth } from "../../context/AuthContext";
import { formatTitleCase } from "../../utils/commonUtil";
import { UpdateDialog } from "../../components/UpdateDialog";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [_refresh, _refreshFn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("scheduled");
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const { addToast } = useToast();
  const menuRef = useRef({});
  const { user } = useAuth();
  useEffect(() => {
    getAppointments();
  }, []);

  const getAppointments = async () => {
    setLoading(true); // Optional: Show loader if needed

    try {
      const response = await axios.get(`${API_ENDPOINTS.GET_APPOINTMENTS_BY_CLIENT_ID}/${user.id}`);

      // Store the appointments in state (assuming you have a state for this)
      setAppointments(response.data.data); // or response.data.data based on your API response
      if (response?.data?.data?.length > 0) {
        setFilteredAppointments(response.data.data.filter((appt) => appt.status === "scheduled"));
      }

      // Optional: Show success message
    } catch (error) {
      console.error("Error fetching appointments:", error);
      addToast(error.response?.data?.msg || "Failed to fetch appointments. Please try again.", "error");
    } finally {
      setLoading(false); // Optional: Hide loader after request
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      const clickedOutsideAll = Object.values(menuRef.current).every((ref) => ref && !ref.contains(event.target));
      if (clickedOutsideAll) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id, appt, mode) => {
    setOpenMenuId(openMenuId === id ? null : id);
    if (mode === "edit") {
      setShowUpdateDialog(true);
      setSelectedAppointment(appt);
    }
    if (mode === "delete") {
      deleteAppointment(id);
    }
  };

  const deleteAppointment = async (appointmentId) => {
    addToast("Cancelling Appointment...", "info");

    try {
      const response = await axios.delete(`${API_ENDPOINTS.DELETE_APPOINTMENT}/${appointmentId}`);

      if (response.status === 200) {
        addToast("Appointment cancelled successfully!", "success");

        // Update the full list
        const updatedAppointments = appointments.map((appt) => (appt._id === appointmentId ? { ...appt, status: "cancelled" } : appt));

        setAppointments(updatedAppointments);

        // Reapply filter based on activeTab
        let updatedFiltered = [];
        if (activeTab === "scheduled") {
          updatedFiltered = updatedAppointments.filter((appt) => appt.status === "scheduled");
        } else if (activeTab === "completed") {
          updatedFiltered = updatedAppointments.filter((appt) => appt.status === "completed");
        } else if (activeTab === "cancelled") {
          updatedFiltered = updatedAppointments.filter((appt) => appt.status === "cancelled");
        }

        setFilteredAppointments(updatedFiltered);
      } else {
        addToast("Failed to cancel appointment. Please try again.", "error");
      }
    } catch (error) {
      addToast(error.response?.data?.message || "An error occurred while cancelling the appointment.", "error");
      console.error("Delete appointment error:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentAPI = async (appointment) => {
    addToast("Update in progress...", "info");
    try {
      const payload = appointment;

      const response = await axios.post(API_ENDPOINTS.APPOINTMENT, payload); // replace with your actual endpoint

      addToast("Appointment re-scheduled successfully", "success");
      getAppointments();
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      addToast(error.response?.data?.message || "Failed to update appointment. Please try again.", "error");
      throw error;
    } finally {
      // setLoading(false);
    }
  };

  const updateAppointment = (updatedAppt, mode) => {
    setShowUpdateDialog(false);
    setSelectedAppointment(null);
    if (mode === "update") {
      updateAppointmentAPI(updatedAppt);
    }
  };

  const getRandomColor = (letter) => {
    const colors = ["bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-purple-100 text-purple-800", "bg-red-100 text-red-800", "bg-yellow-100 text-yellow-800", "bg-indigo-100 text-indigo-800"];
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  const onTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "scheduled") {
      setFilteredAppointments(appointments.filter((appt) => appt.status === "scheduled") || []);
    } else if (tab === "completed") {
      setFilteredAppointments(appointments.filter((appt) => appt.status === "completed") || []);
    } else if (tab === "cancelled") {
      setFilteredAppointments(appointments.filter((appt) => appt.status === "cancelled") || []);
    }
    _refreshFn((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-6 h-6 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {showUpdateDialog && <UpdateDialog selectedAppointment={selectedAppointment} setUpdateAppointment={updateAppointment} />}
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointments</h1>
      <div className="bg-gray-100 rounded-xl flex p-1 w-full max-w-sm mx-auto mb-8">
        <button className={`w-1/2 py-2 font-semibold text-center transition-all duration-200 ${activeTab === "scheduled" ? "bg-white text-slate-900 rounded-l-xl shadow" : "text-gray-500 hover:text-gray-700 !bg-[unset]"}`} onClick={() => onTabClick("scheduled")}>
          Scheduled
        </button>
        <button className={`w-1/2 py-2 font-semibold text-center transition-all duration-200 ${activeTab === "completed" ? "bg-white text-slate-900 rounded-r-xl shadow" : "text-gray-500 hover:text-gray-700 !bg-[unset]"} outline-none border-none ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent focus:border-none`} onClick={() => onTabClick("completed")}>
          Completed
        </button>
        <button className={`w-1/2 py-2 font-semibold text-center transition-all duration-200 ${activeTab === "cancelled" ? "bg-white text-slate-900 rounded-r-xl shadow" : "text-gray-500 hover:text-gray-700 !bg-[unset]"} outline-none border-none ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent focus:border-none`} onClick={() => onTabClick("cancelled")}>
          Cancelled
        </button>
      </div>
      {filteredAppointments.length === 0 ? (
        <div className="flex justify-center items-center py-10">
          <div className="text-gray-500">No appointments found.</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appt) => {
            const date = new Date(appt.dateTime);
            const formattedDate = date.toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            });
            const formattedTime = date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={appt._id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Header section - gray background */}
                <div className="bg-gray-50 px-5 py-6 flex justify-between items-start relative">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium ${getRandomColor(appt.counselorId.name[0])}`}>{appt.counselorId.name[0].toUpperCase()}</div>
                    <div>
                      <h3
                        className="text-[14px] font-medium text-gray-900"
                        style={{
                          fontFamily: "InterVariable, system-ui, sans-serif",
                          fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
                          fontVariationSettings: "normal",
                        }}
                      >
                        {appt.counselorId.name}
                      </h3>
                      <p className="text-sm text-gray-500">{formatTitleCase(appt.counselorId.specialization)}</p>
                    </div>
                  </div>

                  {/* Menu */}
                  {appt.status === "scheduled" && (
                    <div
                      className="relative"
                      ref={(el) => {
                        menuRef.current[appt._id] = el;
                      }}
                    >
                      <button onClick={() => toggleMenu(appt._id, appt)} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                      </button>

                      {openMenuId === appt._id && (
                        <div className=" absolute right-[15px] top-[30px] mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-md z-10">
                          <button onClick={() => toggleMenu(appt._id, appt, "edit")} className="block w-full px-4 py-2 text-[14px] text-gray-500 hover:bg-gray-100">
                            Edit
                          </button>
                          <button onClick={() => toggleMenu(appt._id, appt, "delete")} className="block w-full px-4 py-2 text-[14px] text-red-500 hover:bg-gray-100">
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Divider */}
                <hr className="border-gray-200" />

                {/* content section */}
                <div className="bg-white px-5 py-4 space-y-4 text-sm text-gray-600">
                  {/* Date */}
                  <div className="flex justify-between">
                    <span>Date</span>
                    <span className="text-gray-900">{appt.appointmentTimings.day}</span>
                  </div>
                  <hr className="border-gray-100" />
                  {/* Time */}
                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="text-gray-900">{`${appt.appointmentTimings.from} - ${appt.appointmentTimings.to}`}</span>
                  </div>
                  <hr className="border-gray-100" />
                  {/* Amount + Status */}
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Amount</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">${appt.amount}</span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${appt.paymentStatus === "paid" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>{"Paid"}</span>
                    </div>
                  </div>
                  {appt.status === "scheduled" && appt.join_url && (
                    <>
                      <hr className="border-gray-100" />
                      <div className="flex justify-between items-center">
                        <span>Zoom</span>
                        <a
                          href={appt.join_url} // Replace with your actual URL key
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Join Zoom
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Appointments;
