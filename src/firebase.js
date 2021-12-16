// For Firebase JS SDK v7.20.0 and later, measurementId is optional
import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyBdJn6hHOJ9qxxVwWblJL0EhIsdmCXVpVY",
    authDomain: "whatsapp-clone-741f5.firebaseapp.com",
    projectId: "whatsapp-clone-741f5",
    storageBucket: "whatsapp-clone-741f5.appspot.com",
    messagingSenderId: "1091765229979",
    appId: "1:1091765229979:web:c1a5164634085b9551e93e",
    measurementId: "G-C5ZG9E1P73"
  };

  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = firebaseApp.firestore();
  const auth = firebase.auth();
  const provider = new firebase.auth.GoogleAuthProvider();

  export { auth, provider };
  export default db;