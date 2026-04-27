import axios from "axios";

export const createCashBooking = async (details) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/cash-booking/create`,
    details
  );
  return res.data;
};

export const createManualBooking = async (details) => {
  const res = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/cash-booking/manual`,
    details
  );
  return res.data;
};
