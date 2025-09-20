
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const bookingsRoute = require("./routes/bookings"); 
const authRoutes = require("./routes/auth"); 
const auth = require("./middleware/auth"); 

const app = express();
app.use(cors());
app.use(express.json());


const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/movieapp";
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected to:", MONGO_URI))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// debug logs to inspect what was imported
console.log("bookingsRoute (should be function/router):", bookingsRoute);
console.log("typeof bookingsRoute:", typeof bookingsRoute);
console.log("authRoutes (should be function/router):", authRoutes);
console.log("typeof authRoutes:", typeof authRoutes);

// mount routes
// handle both CommonJS `module.exports = router` and `export default router` cases:
app.use("/api/bookings", bookingsRoute.default || bookingsRoute);

app.use("/api/auth", authRoutes)


app.get("/api/admin/stats", auth, (req, res) => {
  
  if (!req.user || !req.user.isAdmin) {
    return res.status(403).json({ message: "Forbidden" });
  }
  
  res.json({ message: "secret admin stats", stats: { bookingsToday: 42 } });
});


app.use((req, res) => res.status(404).json({ error: "Not found" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
