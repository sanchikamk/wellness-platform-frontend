import { useToast } from "../../context/ToastContext";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlatformContext } from "../../context/PlatformContext";
import axios from "../../utils/axiosInstance"; // Adjust the import path as necessary
import { API_ENDPOINTS } from "../../config/config";
import { formatTitleCase } from "../../utils/commonUtil";

const ClientLanding = () => {
  const { addToast } = useToast();
  const { setSelectedCouncellor } = usePlatformContext();
  const navigateTo = useNavigate();
  const [counselors, setCounselors] = useState([]);
  const [loading, setLoading] = useState(true);

  // const avatarUrls = ["https://randomuser.me/api/portraits/women/1.jpg", "https://randomuser.me/api/portraits/men/1.jpg", "https://randomuser.me/api/portraits/women/2.jpg", "https://randomuser.me/api/portraits/women/3.jpg", "https://randomuser.me/api/portraits/women/4.jpg", "https://randomuser.me/api/portraits/men/2.jpg", "https://randomuser.me/api/portraits/women/5.jpg", "https://randomuser.me/api/portraits/women/6.jpg"];
  const avatarUrls = ["https://randomuser.me/api/portraits/lego/1.jpg", "https://randomuser.me/api/portraits/lego/2.jpg", "https://randomuser.me/api/portraits/lego/3.jpg", "https://randomuser.me/api/portraits/lego/4.jpg", "https://randomuser.me/api/portraits/lego/5.jpg", "https://randomuser.me/api/portraits/lego/6.jpg", "https://randomuser.me/api/portraits/lego/7.jpg", "https://randomuser.me/api/portraits/lego/8.jpg"];

  useEffect(() => {
    getAllCounselors();
  }, []);

  const bookAppointment = (councelor) => {
    setSelectedCouncellor(councelor);
    navigateTo(`/appointments/book/${councelor._id}`);
  };

  const getAllCounselors = async () => {
    setLoading(true); // optional: if you want to show a loader
    try {
      const response = await axios.get(API_ENDPOINTS.GET_COUNCELORS);

      // Do something with the response here (store in state etc.)
      setCounselors(response.data.data); // assuming you have useState for this
      // addToast("Counselors loaded successfully!", "success");
    } catch (error) {
      addToast(error.response?.data?.msg || "Failed to fetch counselors. Please try again.", "error");
    } finally {
      setLoading(false); // optional: if you want to hide the loader
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-6 h-6 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="px-12 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 mt-5">Available Councelors</h1>

      {counselors.length === 0 ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {counselors &&
            counselors?.map((counselor, index) => (
              // const randomImageUrl = `https://source.unsplash.com/200x200/?face&sig=${index}`;
              <div key={index} className="rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-shadow duration-300 flex flex-col h-90 bg-gray-50">
                <div className="p-4 flex-grow">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden mt-5 mb-10">
                      <img
                        src={avatarUrls[index % avatarUrls.length]}
                        alt={counselor.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%239CA3AF'%3E%3Cpath d='M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4 8-4z'/%3E%3C/svg%3E";
                        }}
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 inter-name">Dr. {counselor.name}</h3>
                    <p className="text-sm text-gray-500 mb-2 text-[14px] font-variable">{formatTitleCase(counselor.specialization)} </p>
                    <span className="text-xs px-3 py-1 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium mb-4">{counselor.experience} years </span>
                  </div>
                </div>

                <div className="px-4 pb-4">
                  <div className="flex justify-center space-x-4 border-gray-200 border-t pt-3">
                    <button className="text-white hover:bg-slate-500 font-medium py-1 transition-colors duration-300 bg-slate-800" onClick={() => bookAppointment(counselor)}>
                      Book Appointment
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};
export default ClientLanding;
