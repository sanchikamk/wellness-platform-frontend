export const BASE_API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

export const API_ENDPOINTS = {
  LOGIN: `${BASE_API_URL}/auth/login`,
  REGISTER: `${BASE_API_URL}/auth/register`,
  GET_COUNCELORS: `${BASE_API_URL}/councelors/getCouncelors`,
  GET_APPOINTMENTS_BY_CLIENT_ID: `${BASE_API_URL}/appointments/client`,
  DELETE_APPOINTMENT: `${BASE_API_URL}/appointments`,
  CREATE_PAYMENT_INTENT: `${BASE_API_URL}/stripe/create-payment-intent`,
  APPOINTMENT: `${BASE_API_URL}/appointments`,
  GET_COUNCELLOR_BY_ID: `${BASE_API_URL}/auth/user`,
  GENERATE_ZOOM_TOKEN: `${BASE_API_URL}/zoom/token`,
  CREATE_ZOOM_MEETING: `${BASE_API_URL}/zoom/create-meeting`
};

export const APP_NAME = "Wellness Platform";
