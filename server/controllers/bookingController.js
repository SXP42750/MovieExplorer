const bookingService = require('../services/bookingService');
exports.getBookings = async (req, res) => {
try {
const { bookings, totalRevenue } = await bookingService.getAllBookings();
res.status(200).json({ bookings, totalRevenue });
} catch (error) {
console.error('Error in getBookings:', error);
res.status(500).json({ error: 'Failed to fetch bookings' });
}
};


exports.createBooking = async (req, res) => {
try {
const booking = await bookingService.createBooking(req.body);
res.status(201).json(booking);
} catch (error) {
console.error('Error in createBooking:', error);
res.status(400).json({ error: 'Failed to create booking' });
}
};