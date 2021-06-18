importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.3.1/firebase-messaging.js');
// let firebaseConfig = {
//   apiKey: "AIzaSyBQkWpqcWJjdA8pTiggKMFqNDyDJ3DtHIs",
//   authDomain: "cowinvueweb.firebaseapp.com",
//   projectId: "cowinvueweb",
//   storageBucket: "cowinvueweb.appspot.com",
//   messagingSenderId: "516251031829",
//   appId: "1:516251031829:web:44ddcae94651581f73311c",
//   measurementId: "G-VGCFRT0FT6"
// };
let firebaseConfig = {
  apiKey: "AIzaSyB1oIr9RWzg7AzzLX9LvAKLdhokcG3X36Q",
  authDomain: "cowinvue.firebaseapp.com",
  projectId: "cowinvue",
  storageBucket: "cowinvue.appspot.com",
  messagingSenderId: "863606037068",
  appId: "1:863606037068:android:94697717af36f0507e72e9",
  measurementId: "G-VGCFRT0FT6"
};
firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();
