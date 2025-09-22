const Booking = require('../models/Booking');



const PRICE_PER_TICKET = Number(process.env.PRICE_PER_TICKET) || 20;


async function createBooking(data) {
const { movieTitle, movieId, tickets, seats, date, time, user, userEmail } = data;


const totalAmount = (Number(tickets) || 0) * PRICE_PER_TICKET;


const booking = new Booking({
movieTitle,
movieId,
tickets,
seats: Array.isArray(seats) ? seats : [],
date: date ? new Date(date) : new Date(),
time,
user:user || 'Guest',
userEmail:userEmail || 'null',
totalAmount,
status: 'Confirmed',
});


await booking.save();
return booking;
}


async function getAllBookings() {
const bookings = await Booking.find().sort({ createdAt: -1 });
const totalRevenue = bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0);
return { bookings, totalRevenue };
}


async function getAggregatedRevenue() {
const revenueAgg = await Booking.aggregate([
{ $group: { _id: null, totalRevenue: { $sum: '$totalAmount' } } },
]);
return revenueAgg[0]?.totalRevenue || 0;
}


module.exports = {
createBooking,
getAllBookings,
getAggregatedRevenue,
};