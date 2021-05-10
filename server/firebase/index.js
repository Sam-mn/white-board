const firebase = require("firebase/app");
require("firebase/firestore");

var firebaseConfig = {
    apiKey: process.env.APIKEY,
    authDomain: process.env.AUTHDOMAIN,
    databaseURL: process.env.DATABASEURL,
    projectId: process.env.PROJECTID,
    storageBucket: process.env.STORAGEBUCKET,
    messagingSenderId: process.env.MESSAGINGSENDERID,
    appId: process.env.APPID,
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

module.exports = { db, firebase };
