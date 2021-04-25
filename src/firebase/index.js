import firebase from "firebase/app";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyDVgH7mOMehNkrFACDMzdObYtD50mqqmm0",
    authDomain: "awesome-todos-7b1b6.firebaseapp.com",
    databaseURL: "https://awesome-todos-7b1b6.firebaseio.com",
    projectId: "awesome-todos-7b1b6",
    storageBucket: "awesome-todos-7b1b6.appspot.com",
    messagingSenderId: "971662902753",
    appId: "1:971662902753:web:5b95427911f6d1de617ea0",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db, firebase as default };
