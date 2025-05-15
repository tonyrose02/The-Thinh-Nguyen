import { initializeApp, getApps, getApp } from 'firebase/app'
import { initializeAuth, getReactNativePersistence, signInWithEmailAndPassword } from 'firebase/auth'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
}

// Initialize Firebase
let app
if (!getApps().length) {
  app = initializeApp(firebaseConfig)
} else {
  app = getApp()
}

// Initialize Firebase Authentication with persistence
// The way this is works is that the authentication state (when the user is logged in) is stored in the AsyncStorage,
// which means that the user will be logged in even if the app is closed, and the user will be logged in even if the app is reopened.
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
})

const callFn = async (fn: any, args: any) => {
  const callFn = httpsCallable(functions, fn);
  const result = await callFn(args);
  return result.data;
};

const doSignInWithEmailAndPassword = async (auth: any, email: any, password: any) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
    return { result: true };
  } catch (e: any) {
    let errorMessage = 'An error occurred during login.';

    // Map Firebase error codes to user-friendly messages
    switch (e.code) {
      case 'auth/invalid-email':
        errorMessage = 'The email address is invalid.';
        break;
      case 'auth/user-not-found':
        errorMessage = 'No user found with this email address.';
        break;
      case 'auth/wrong-password':
        errorMessage = 'Incorrect password. Please try again.';
        break;
      case 'auth/network-request-failed':
        errorMessage = 'Network error. Please check your internet connection.';
        break;
      default:
        errorMessage = 'An unexpected error occurred. Please try again later.';
        break;
    }

    // Optionally store error for debugging or other purposes
    AsyncStorage.setItem('loginError', e.code);
    return { error: errorMessage, result: false };
  }
};



const getCompanyForUser = async () => {
  const company = await callFn("companies-getCompanyForUser", {});
  return company;
};

const getCompanyByCompanyId = async (companyId: any) => {
  const company = await callFn("companies-getCompanyByCompanyId", {
    companyId,
  });
  return company;
};

const saveChat = async (chatId: any, chat: any, companyId: any, companyName: any) => {
  const result = await callFn("gemini-saveChat", {
    chatId,
    chat,
    companyId,
    companyName
  });
  return result;
}

const getPastChats = async (companyId: any) => {
  const result = await callFn("gemini-getPastChats", {
    companyId
  });
  return result;
}

const getGeminiKey = async () => {
  try {
    const key = await callFn('gemini-getGeminiApiKey', {});
    return key;
  }
  catch (e) {
    console.error(e);
    return null;
  }
}


export { auth }
export const functions = getFunctions(app);
export const db = getFirestore(app);
export { callFn, getCompanyForUser, getCompanyByCompanyId, saveChat, getPastChats, getGeminiKey, doSignInWithEmailAndPassword };