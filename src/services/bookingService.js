import { db,auth} from "../auth/firebase";
import { collection, addDoc, getDocs, serverTimestamp } from "firebase/firestore";

const BOOKINGS_COLLECTION = "bookings";


export const saveBooking = async (bookingData) => {
  try {
    const user = auth.currentUser; 
    if (!user) throw new Error("You must be logged in to book.");

     console.log("Saving booking for:", user.displayName, user.email); 
    console.log("Booking data:", bookingData);

    const docRef = await addDoc(collection(db, BOOKINGS_COLLECTION), {
      ...bookingData, 
      userName: user.displayName || "Guest" ,  
      userEmail: user.email || "",       
      createdAt: serverTimestamp(),  
      bookingTime : Date.now() 
    });
    console.log("Booking saved with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding booking: ", e);
  }
};


export const getBookings = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, BOOKINGS_COLLECTION));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (e) {
    console.error("Error fetching bookings: ", e);
    return [];
  }
};
