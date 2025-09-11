import { initializeApp } from "firebase/app"; // creates a single auth object 
import { getAuth, GoogleAuthProvider , signInWithPopup, signOut, signInWithEmailAndPassword} from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

export const app = initializeApp(firebaseConfig); //creates firebase object
export const auth = getAuth(app); // single instance of auth we are exporting so that we can use it anywhere in the app
export const db = getFirestore(app);

export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" }); // forces the account selection even if user is already signed in
export const loginWithGoogle = () => signInWithPopup(auth, googleProvider); // handles actual login 

export const loginWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
export const logout = () => signOut(auth);

