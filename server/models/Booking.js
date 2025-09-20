import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    movieTitle: { type: String, required: true },
    movieId: { type: Number, required: true },
    tickets: { type: Number, required: true },
    seats: { type: [String], default: [] },
    date: { type: Date, required: true },     
    time: { type: String, required: true },   
    user: { type: String, required: true },
    userEmail: { type: String, required: true },
    status: { type: String, default: "Pending" },
    totalAmount: { type: Number, required: true }
  },
  { timestamps: true } 
);

export default mongoose.model("Booking", bookingSchema);
