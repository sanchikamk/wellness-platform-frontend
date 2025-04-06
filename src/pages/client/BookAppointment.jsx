import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePlatformContext } from "../../context/PlatformContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faClock, faMoneyBillWave } from "@fortawesome/free-solid-svg-icons";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import CheckoutForm from "../../components/CheckoutForm";
import PaymentSuccess from "../../components/PaymentSuccess";
import axios from "../../utils/axiosInstance"; // Adjust the import path as necessary
import { API_ENDPOINTS } from "../../config/config";
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../../context/ToastContext";
import { useParams } from "react-router-dom";
import { formatTitleCase } from "../../utils/commonUtil";

const BookAppointment = () => {
  // const { selectedCouncellor, setSelectedCouncellor } = usePlatformContext();
  const [councellor, setCouncellor] = useState(null);
  const stripePromise = loadStripe("pk_test_51RAFrwQM1kUH1d2UuapBZEa7QsKYSFmk1jNiMTFPAmd6Gbr5fqWqcF8ZsXPXNoMlQq1fYpyQPrb7kSVSSWQdyH4X00sm7ttJe2");
  const navigateTo = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();
  const { id } = useParams();
  const [showPayment, setShowPayment] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   getSelectedCouncellor();
  // }, []);

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [availability, setAvailability] = useState({
    day: tomorrow.toISOString().split("T")[0],
    from: "",
    to: "",
  });

  const setAvailabilityTime = (e) => {
    const from = e.target.value;
    const [hour, minute, meridian] = from.match(/(\d+):(\d+) (\w+)/).slice(1);
    let h = parseInt(hour);
    let m = parseInt(minute);
    if (meridian === "PM" && h !== 12) h += 12;
    if (meridian === "AM" && h === 12) h = 0;
    m += 30;
    if (m >= 60) {
      h += 1;
      m -= 60;
    }
    const toHour = h % 12 || 12;
    const toMeridian = h >= 12 ? "PM" : "AM";
    const toTime = `${toHour}:${m.toString().padStart(2, "0")} ${toMeridian}`;
    setAvailability({ ...availability, from, to: toTime });
  };

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  useEffect(() => {
    getSelectedCouncellor();
  }, []);

  const getSelectedCouncellor = async () => {
    setLoading(true); // optional: if you want to show a loader
    try {
      const response = await axios.get(`${API_ENDPOINTS.GET_COUNCELLOR_BY_ID}/${id}`);
      // Do something with the response here (store in state etc.)
      setCouncellor(response.data.data); // assuming you have useState for this
      // addToast("Counselors loaded successfully!", "success");
    } catch (error) {
      console.error("Failed to fetch counselor:", error);
      addToast(error.response?.data?.msg || "Failed to fetch counselors. Please try again.", "error");
    } finally {
      // console.error("Failed to fetch counselor:", error);
      setLoading(false); // optional: if you want to hide the loader
    }
  };

  const getStartTimeISO = () => {
    const [hourMin, meridian] = availability.from.split(" ");
    let [hours, minutes] = hourMin.split(":").map(Number);

    // Convert to 24-hour format
    if (meridian.toUpperCase() === "PM" && hours !== 12) hours += 12;
    if (meridian.toUpperCase() === "AM" && hours === 12) hours = 0;

    // Create Date object using availability.day and parsed time
    const date = new Date(`${availability.day}T${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00+05:30`);

    // Convert to ISO string
    return date.toISOString();
  };

  const createAppointment = async (mode = "success") => {
    // setLoading(true); // optional loader
    try {
      // Create random paymentId like PAY_123456
      let zoomJoinUrl = "";

      if (mode !== "cancel") {
        // 1. Get Zoom Access Token
        const tokenRes = await axios.get(API_ENDPOINTS.GENERATE_ZOOM_TOKEN);
        const accessToken = tokenRes.data.accessToken;

        // 2. Create Zoom Meeting
        const zoomRes = await axios.post(API_ENDPOINTS.CREATE_ZOOM_MEETING, {
          topic: `Counseling with ${councellor.name}`,
          start_time: getStartTimeISO() || new Date().toISOString(),
          accessToken,
        });

        zoomJoinUrl = zoomRes.data.data.join_url;
      }

      const payload = {
        clientId: user.id,
        counselorId: councellor._id,
        appointmentTimings: {
          day: availability.day,
          from: availability.from,
          to: availability.to,
        },
        sessionType: councellor.specialization,
        status: mode === "cancel" ? "cancelled" : "scheduled",
        amount: 500,
        paymentId: "PAY_" + Math.floor(100000 + Math.random() * 900000),
        paymentStatus: mode === "cancel" ? "failed" : "paid",
        join_url: zoomJoinUrl,
      };

      const response = await axios.post(API_ENDPOINTS.APPOINTMENT, payload); // replace with your actual endpoint

      if (mode === "cancel") {
        addToast("Payment cancelled", "info");
        navigateTo("/client");
      } else {
        setTimeout(() => {
          addToast("Appointment booked successfully!", "success");
          navigateTo("/appointments");
        }, 1000);
      }
      // Optional: Toast and navigation
      return response.data;
    } catch (error) {
      console.error("Error creating appointment:", error);
      addToast(error.response?.data?.message || "Failed to create appointment. Please try again. Amount will be refunded if debited", "error");
      throw error;
    } finally {
      // setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    createAppointment();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleCancelClick = () => {
    if (showPayment) {
      createAppointment("cancel");
      return;
    }
    navigateTo("/client");
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 7);
    return maxDate.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="w-6 h-6 border-4 border-blue-300 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-screen flex overflow-auto">
      <div className="hidden md:flex w-1/2 bg-slate-900 p-12 flex-col justify-center items-center text-white">
        <div className="w-full flex flex-col items-center text-center">
          <div className="flex items-center mb-8 relative right-[10px]">
            <div className="w-full max-w-md">
              {" "}
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4 overflow-hidden">
                  <svg className="w-full h-full text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xl mb-1 font-semibold">Dr. {councellor?.name}</p>
                  <p className="text-gray-400 relative right-2">{formatTitleCase(councellor?.specialization)}</p>
                </div>
              </div>
            </div>
          </div>
          <ul className="space-y-6 text-lg">
            <li className="flex items-center">
              <FontAwesomeIcon icon={faUser} className="w-6 h-6 mr-4 text-white" />
              {councellor?.experience} years of total experience
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faClock} className="w-6 h-6 mr-4 text-white" />
              {"30 Minutes Session"}
            </li>
            <li className="flex items-center">
              <FontAwesomeIcon icon={faMoneyBillWave} className="w-6 h-6 mr-4 text-white" />
              {"Consultation Fee : 500"}
            </li>
          </ul>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full md:w-1/2 bg-white flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {paymentCompleted ? (
            <PaymentSuccess />
          ) : (
            <>
              {/* Tab Navigation */}
              <div className="bg-slate-800 rounded-xl flex p-1 w-full max-w-xs mx-auto mb-8">
                <button className={`w-full py-2 font-semibold text-center transition-all duration-200 "bg-white text-slate-900 rounded-r-xl shadow"} outline-none border-none ring-0 ring-transparent focus:outline-none focus:ring-0 focus:ring-transparent focus:border-none text-white`}>Select a slot to book</button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                        </svg>
                      </span>
                      <input type="date" id="date" name="date" value={availability.day} min={getMinDate()} max={getMaxDate()} onChange={(e) => setAvailability((prev) => ({ ...prev, day: e.target.value }))} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" />
                    </div>
                    {/* {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>} */}
                  </div>
                  <div className="col-span-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1"> Select Time</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 1a11 11 0 1 0 11 11A11.012 11.012 0 0 0 12 1zm0 20a9 9 0 1 1 9-9a9.01 9.01 0 0 1-9 9zm.5-13h-1v6l5.25 3.15l.5-.86l-4.75-2.79z" />
                        </svg>
                      </span>
                      <select id="time" name="from" value={availability.from} onChange={(e) => setAvailabilityTime(e)} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500">
                        <option value="">Select a time</option>
                        <option>9:00 AM</option>
                        <option>10:00 AM</option>
                        <option>3:00 PM</option>
                        <option>4:00 PM</option>
                        <option>5:00 PM</option>
                      </select>
                    </div>
                  </div>
                </div>
                {showPayment && (
                  <Elements stripe={stripePromise}>
                    <CheckoutForm amount={50000} onPaymentSuccess={handlePaymentSuccess} />
                  </Elements>
                )}
                <div className="flex gap-4">
                  <button type="button" onClick={handleCancelClick} className="w-full bg-gray-300 text-slate-900 py-3 px-4 rounded-md hover:bg-gray-400 focus:outline-none flex items-center justify-center">
                    Cancel
                  </button>
                  {!showPayment && (
                    <button
                      type="button"
                      onClick={() => setShowPayment(true)}
                      className={`w-full py-3 px-4 rounded-md font-medium transition-all duration-200 
                      ${availability.from && availability.to && availability.day ? "bg-slate-800 text-white hover:bg-slate-800" : "bg-slate-500 text-white cursor-not-allowed"}
                    `}
                      disabled={!(availability.from && availability.day && availability.to)}
                    >
                      Proceed to Payment
                    </button>
                  )}
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;
