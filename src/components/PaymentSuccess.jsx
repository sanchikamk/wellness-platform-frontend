// components/PaymentSuccess.js
import React from "react";
import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const PaymentSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
      <FontAwesomeIcon
        icon={faCheckCircle}
        className="text-green-500 text-6xl animate-bounce mb-4"
      />
      <h2 className="text-2xl font-semibold text-green-600">Payment Successful!</h2>
      <p className="text-gray-700 mt-2">Your session has been booked successfully.</p>
    </div>
  );
};

export default PaymentSuccess;
