import { initializeApp } from 'firebase/app';
export const firebaseConfig = {
  apiKey: "AIzaSyAtgg4s1PeyHmNOT4FpwkV0ajf0vuPNacQ",
  authDomain: "saferoad-frontend.firebaseapp.com",
  projectId: "saferoad-frontend",
  storageBucket: "saferoad-frontend.firebasestorage.app",
  messagingSenderId: "641755756188",
  appId: "1:641755756188:web:58913a988b07d1782b5f59"
};
export const firebaseApp = initializeApp(firebaseConfig);