import axios from "axios";

export const createOrder = async (paymentDetails) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/payment/create-order`, paymentDetails);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};
