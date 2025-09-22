const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');


// Create booking
router.post('/', bookingController.createBooking);


// Get bookings + revenue
router.get('/', bookingController.getBookings);


module.exports = router;