import axios from "axios";
const API_URL = "http://localhost:5000/api/bookings";

export const saveBooking = async (bookingData) => {
  const res = await axios.post(API_URL, bookingData);
  return res.data;
};

export const getBookings = async () => {
  try {
    const res = await axios.get(API_URL);
    return res.data; 
  } catch (err) {
    console.error("Error fetching bookings:", err.message);
    throw err;
  }
};
