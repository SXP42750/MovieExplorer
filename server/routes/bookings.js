
import express from "express";
import Booking from "../models/Booking.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { movieTitle, movieId, tickets, seats, date, time, user, userEmail } = req.body;

    const pricePerTicket = 20; 
    const totalAmount = (Number(tickets) || 0) * pricePerTicket;

    const booking = new Booking({
      movieTitle,
      movieId,
      tickets,
      seats: Array.isArray(seats) ? seats : [],
      date: date ? new Date(date) : new Date(), 
      time,
      user,
      userEmail,
      totalAmount
    });

    await booking.save();
    
    res.status(201).json({ booking });
  } catch (error) {
    console.error("Error saving booking:", error);
    res.status(500).json({ error: "Failed to save booking" });
  }
});


router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({ createdAt: -1 });
    console.log("Bookings from DB:", bookings);  
    const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
    res.json({ bookings, totalRevenue });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
});

export default router;
