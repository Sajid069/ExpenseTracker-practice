import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyD01jp7M1AYmHFGywEDw1giilNOJ7EIHd4",
  authDomain: "expense-tracker-app-6bd7c.firebaseapp.com",
  projectId: "expense-tracker-app-6bd7c",
  storageBucket: "expense-tracker-app-6bd7c.firebasestorage.app",
  messagingSenderId: "1078441182685",
  appId: "1:1078441182685:web:ba841f191123ba882ea234"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;