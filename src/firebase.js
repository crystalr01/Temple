import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBY62kVU4FDZ1w_PAD4-gdWIgInLErguRY",
  authDomain: "dazzle-b3038.firebaseapp.com",
  databaseURL: "https://dazzle-b3038-default-rtdb.firebaseio.com",
  projectId: "dazzle-b3038",
  storageBucket: "dazzle-b3038.appspot.com",
  messagingSenderId: "737090504508",
  appId: "1:737090504508:web:5569a436939eed3ee5c039",
  measurementId: "G-58THLST5X0"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const storage = getStorage(app);
const database = getDatabase(app);

export { app, analytics, storage, database }; 