// src/pages/counselor/CounselorLanding.jsx
import { useToast } from "../../context/ToastContext";
import React, { useState, useEffect, useRef } from "react";

const CounselorLanding = () => {
  const { addToast } = useToast();
  const menuRef = useRef(null);

  // useEffect(() => {
  //   addToast("Login successful! Welcome back.", "success");
  // }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dummyAppointments = [
    {
      id: 1,
      clientName: "John Doe",
      service: "Therapy Session",
      dateTime: "2025-04-10T14:30:00",
      amount: 2000.0,
      status: "Overdue",
    },
    {
      id: 2,
      clientName: "Jane Smith",
      service: "Counseling",
      dateTime: "2025-04-12T10:15:00",
      amount: 1600.0,
      status: "Paid",
    },
    {
      id: 3,
      clientName: "Robert Johnson",
      service: "Consultation",
      dateTime: "2025-04-15T16:45:00",
      amount: 1600.0,
      status: "Paid",
    },
  ];

  const [openMenuId, setOpenMenuId] = useState(null);

  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const getRandomColor = (letter) => {
    const colors = ["bg-blue-100 text-blue-800", "bg-green-100 text-green-800", "bg-purple-100 text-purple-800", "bg-red-100 text-red-800", "bg-yellow-100 text-yellow-800", "bg-indigo-100 text-indigo-800"];
    const index = letter.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Appointments</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyAppointments.map((appt) => {
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
            <div key={appt.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
              {/* Header section - gray background */}
              <div className="bg-gray-50 px-5 py-6 flex justify-between items-start relative">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-sm font-medium ${getRandomColor(appt.clientName[0])}`}>{appt.clientName[0].toUpperCase()}</div>
                  <div>
                    <h3
                      className="text-[14px] font-medium text-gray-900"
                      style={{
                        fontFamily: "InterVariable, system-ui, sans-serif",
                        fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
                        fontVariationSettings: "normal",
                      }}
                    >
                      {appt.clientName}
                    </h3>
                    <p className="text-sm text-gray-500">{appt.service}</p>
                  </div>
                </div>

                {/* Menu */}
                <div className="relative" ref={menuRef}>
                  <button onClick={() => toggleMenu(appt.id)} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6 10a2 2 0 11-4 0 2 2 0 014 0zM12 10a2 2 0 11-4 0 2 2 0 014 0zM18 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </button>

                  {openMenuId === appt.id && (
                    <div onClick={() => toggleMenu(appt.id)} className=" absolute right-[15px] top-[30px] mt-1 w-36 bg-white border border-gray-200 rounded-md shadow-md z-10">
                      <button className="block w-full px-4 py-2 text-[14px] text-gray-500 hover:bg-gray-100">Edit</button>
                      <button className="block w-full px-4 py-2 text-[14px] text-red-500 hover:bg-gray-100">Delete</button>
                    </div>
                  )}
                </div>
              </div>

              {/* Divider */}
              <hr className="border-gray-200" />

              {/* content section */}
              <div className="bg-white px-5 py-4 space-y-4 text-sm text-gray-600">
                {/* Date */}
                <div className="flex justify-between">
                  <span>Last invoice</span>
                  <span className="text-gray-900">{formattedDate}</span>
                </div>
                <hr className="border-gray-100" />

                {/* Time */}
                <div className="flex justify-between">
                  <span>Time</span>
                  <span className="text-gray-900">{formattedTime}</span>
                </div>
                <hr className="border-gray-100" />

                {/* Amount + Status */}
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900">${appt.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${appt.status === "Paid" ? "bg-green-100 text-green-800 border border-green-200" : "bg-red-100 text-red-700 border border-red-200"}`}>{appt.status}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CounselorLanding;
