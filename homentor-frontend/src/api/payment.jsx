import axios from "axios";

export const createOrder = async (paymentDetails) => {
  try {
    const response = await axios.post("https://homentor-backend.onrender.com/api/payment/create-order", paymentDetails);
    return response.data;
  } catch (error) {
    console.error(error.response?.data || error.message);
    throw error;
  }
};
