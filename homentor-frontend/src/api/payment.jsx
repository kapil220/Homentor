import axios from "axios";

export const createOrder = async (paymentDetails) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/payment/create-order`, paymentDetails, { timeout: 20000 });
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};
