import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAnI3wc61RHfvLCFBzxHyZEeMKyW0flnR0",
  authDomain: "attendence-6ca39.firebaseapp.com",
  projectId: "attendence-6ca39",
  storageBucket: "attendence-6ca39.appspot.com",
  messagingSenderId: "214551747195",
  appId: "1:214551747195:web:89a493e76fc5eaf3f1a0de"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
