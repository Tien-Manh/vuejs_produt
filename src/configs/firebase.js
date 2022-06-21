import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import {getDatabase} from 'firebase/database'
import {getStorage, ref} from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyBUO7tezifGtaZfiggMT0j0MmVO86U3Ojg",
    authDomain: "appjs-e41bc.firebaseapp.com",
    databaseURL: "https://appjs-e41bc-default-rtdb.firebaseio.com",
    projectId: "appjs-e41bc",
    storageBucket: "appjs-e41bc.appspot.com",
    messagingSenderId: "768518418566",
    appId: "1:768518418566:web:f1064f6ea120d6d56aa107",
    measurementId: "G-8MJE95TM0N"
  };
  
  // Initialize Firebase
const app = initializeApp(firebaseConfig);
//   const analytics = getAnalytics(app);
const auth = getAuth();
const database =  getDatabase()
const storage = getStorage(app)
export  {auth, signInWithEmailAndPassword , database, storage, ref};