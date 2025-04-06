import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle, faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { faCalendar, faHeartPulse } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const profileMenuRef = useRef({});
  const { user, clearAuth } = useAuth();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setProfileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navigateToAppointments = () => {
    navigate("/appointments");
  };

  const navigateToLandingPage = () => {
    if (user?.role === "client") {
      navigate("/client");
    } else {
      navigate("/counselor");
    }
  };

  const handleLogout = () => {
    clearAuth();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800">
      <div className="mx-2 px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo and desktop menu */}
          <div className="flex items-center">
            <div className="flex items-center space-x-3 cursor-pointer hover:text-gray-300 w-14 h-14 w-full" onClick={navigateToLandingPage}>
              <FontAwesomeIcon icon={faHeartPulse} className="text-white w-14 h-14 animate-pulse" />
            </div>
            <div className="flex-shrink-0">
              <h1 className="text-xl font-semibold text-white cursor-pointer" onClick={navigateToLandingPage}>
                Wellness Platform
              </h1>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button type="button" className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Profile section */}
          <div className="flex items-center gap-4">
            {/* Appointments Link */}
            <div className="text-lg font-semibold text-white cursor-pointer hover:text-gray-300" onClick={navigateToAppointments}>
              <FontAwesomeIcon icon={faCalendar} className="text-white h-8 w-8" />
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button type="button" onClick={() => setProfileMenuOpen(!profileMenuOpen)} className="profile-button focus:outline-none focus:ring-0 border-none p-0">
                <img
                  src="https://avatar.iran.liara.run/public/33" // You can replace this with any image URL or dynamic user image
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover"
                />
              </button>

              {/* Dropdown Menu */}
              {profileMenuOpen && (
                <div ref={profileMenuRef} className="absolute right-5 top-10 mt-2 w-48 rounded-md bg-white shadow-lg py-1 z-50">
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setProfileMenuOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    Profile
                  </div>
                  <div
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      handleLogout();
                      setProfileMenuOpen(false);
                    }}
                  >
                    <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                    Logout
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
