const { initializeApp } = require("firebase/app");

const admin = require("firebase-admin");

var serviceAccount = require("./deshcamdemo-firebase-adminsdk-rsn45-3ada56d123.json");

const firebaseConfig = {
 apiKey: "AIzaSyDCjLooL2Hy3f4LjF_o22d6-cVeZPY3oB8",
 authDomain: "like-me-call.firebaseapp.com",
 databaseURL: "https://like_me-call.firebaseio.com",
 projectId: "like-me-call",
 storageBucket: "like-me-call.appspot.com",
 messagingSenderId: "1039962312142",
 appId: "1:1039962312142:web:739bfcbf284d383a72af9f",
 measurementId: "G-6CTJFPWLYP",
};

const adminApp = firebase.initializeApp(firebaseConfig);

module.exports = adminApp;
