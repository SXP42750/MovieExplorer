const Booking = require('../models/Booking');

exports.getBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({});

    const revenueAgg = await Booking.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" } 
        }
      }
    ]);

    const totalRevenue = revenueAgg[0]?.totalRevenue || 0;

    res.status(200).json({
      bookings,
      totalRevenue
    });
  } catch (error) {
    console.error("Error in getBookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
};
exports.createBooking = async (req, res) => {
  try {
    const newBooking = new Booking(req.body);
    await newBooking.save();
    res.status(201).json(newBooking);
  } catch (error) {
    console.error("Error in createBooking:", error);
    res.status(400).json({ error: "Failed to create booking" });
  }
};
