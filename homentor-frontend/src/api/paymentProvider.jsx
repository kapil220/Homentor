import { createPayuOrder, submitPayuForm } from "./payuPayment.jsx";

export const initiateCheckout = async (details) => {
  const data = await createPayuOrder(details);
  localStorage.setItem("orderId", data.order_id);
  localStorage.setItem("paymentProvider", "payu");
  submitPayuForm({ action: data.action, payload: data.payload });
  return data;
};
