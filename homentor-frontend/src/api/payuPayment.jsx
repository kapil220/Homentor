import axios from "axios";

export const createPayuOrder = async (paymentDetails) => {
  const response = await axios.post(
    `${import.meta.env.VITE_API_BASE_URL}/payu/create-order`,
    paymentDetails
  );
  return response.data;
};

export const submitPayuForm = ({ action, payload }) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = action;
  form.style.display = "none";

  Object.entries(payload).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value == null ? "" : String(value);
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};
