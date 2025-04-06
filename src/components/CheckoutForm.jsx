import React, { useEffect, useState } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import axios from "../utils/axiosInstance";
import { API_ENDPOINTS } from "../config/config";
import { useToast } from "../context/ToastContext";

const CheckoutForm = ({ amount, onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false); // For payment spinner
  const [cardComplete, setCardComplete] = useState(false);
  const { addToast } = useToast();

  const getClientSecret = async () => {
    setLoading(true);
    try {
      const res = await axios.post(API_ENDPOINTS.CREATE_PAYMENT_INTENT, {
        amount,
        currency: "inr",
      });
      setClientSecret(res.data.clientSecret);
    } catch (error) {
      addToast(error.response?.data?.error || "Payment setup failed", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (amount) {
      getClientSecret();
    }
  }, [amount]);

  // i am setting the payment status to success irrespective of the payment status from api.
  // this is beacause since i am using test account, payment success will happen only using test card.
  // if you use real card, payment will fail saying we need to use test acard for test account.
  // test card details - 4242 4242 4242 4242 - <any-future-expiry> <any 3-digit cvv>

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements || !clientSecret) return;

    setProcessing(true); // Show spinner

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (result.error) {
      // addToast("Payment successful!", "success");
      onPaymentSuccess();
    //   addToast(result.error.message, "error"); // commented since it is test a account
      setProcessing(false);
    } else if (result.paymentIntent.status === "succeeded") {
      if (onPaymentSuccess) onPaymentSuccess(); // 🔥 Trigger parent callback
      setProcessing(false);
    }
  };

  const handleCardChange = (event) => {
    setCardComplete(event.complete);
  };

  return (
    // <form onSubmit={handleSubmit} className="space-y-6">
    <>
      <CardElement className="p-4 border border-gray-300 rounded-md" onChange={handleCardChange} />
      <button type="submit" disabled={!stripe || !clientSecret || !cardComplete || loading || processing} onClick={handleSubmit} className={`w-full py-2 px-4 rounded-md text-white flex justify-center items-center transition-all duration-200 ${!stripe || !clientSecret || !cardComplete || loading || processing ? "bg-indigo-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"}`}>
        {processing ? (
          <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
          </svg>
        ) : (
          `Pay ₹${amount / 100}`
        )}
      </button>
    </>
    // </form>
  );
};

export default CheckoutForm;
