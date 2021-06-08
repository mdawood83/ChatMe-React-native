// import * as firebase from 'firebase/app';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCUQphwHGBZoCwvZHu5yUAg399S0wZLEWQ',
  authDomain: 'chat-me-a84ab.firebaseapp.com',
  projectId: 'chat-me-a84ab',
  storageBucket: 'chat-me-a84ab.appspot.com',
  messagingSenderId: '45229167818',
  appId: '1:45229167818:web:f58efe1c1d13b51f7e1033',
};

let app;

if (firebase.apps.length === 0) {
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.app();
}

const db = app.firestore();
const auth = firebase.auth();

export { db, auth };
