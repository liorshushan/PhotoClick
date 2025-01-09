import axios from "axios";

export const createOrder = async (orderData) => {
  try {
    const response = await axios.post(
      "http://localhost:8801/api/createOrder",
      orderData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
