import { db,auth} from "../auth/firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

const BOOKINGS_COLLECTION = "bookings";

// Save a booking
export const saveBooking = async (bookingData) => {
  try {
    const user = auth.currentUser; // Get the currently logged-in user
    if (!user) throw new Error("You must be logged in to book.");

     console.log("📌 Saving booking for:", user.displayName, user.email); 
    console.log("📌 Booking data:", bookingData);

    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...bookingData, // spread operator into the document
      userName: user.displayName || "Guest" ,   // ✅ Save Google name
      userEmail: user.email || "",        // ✅ Save email too
      createdAt: serverTimestamp(),  // server generated timestamp
      bookingTime : Date.now()            // ✅ Firestore timestamp for sorting
    });
    console.log("Booking saved with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding booking: ", e);
  }
};

// Get all bookings
export const getBookings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching bookings: ", e);
    return [];
  }
};
