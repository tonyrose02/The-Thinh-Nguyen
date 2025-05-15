import firebase from "firebase/compat/app";
import { initializeApp, getApps, getApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
// import AsyncStorage from '@react-native-async-storage/async-storage'
import { getFunctions, httpsCallable } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore'
// import "@react-native-firebase/firestore";
// import "@react-native-firebase/functions";
// import firebase from "@react-native-firebase/app";
import "@react-native-firebase/auth";
import { AuthCredential } from "@firebase/auth";
import { FirebaseAuthTypes, signInWithEmailAndPassword } from "@react-native-firebase/auth";
import { Alert } from "react-native";

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_APP_ID,
  measurementId: process.env.EXPO_PUBLIC_MEASUREMENT_ID
}

// export const Firebase = () => {
//   let db, auth, functions;
//   const getFirebase = async () => {
//     let app
//     if (!getApps().length) {
//       app = initializeApp(firebaseConfig)
//     } else {
//       app = getApp()
//     }
//   };
//   db = firebase.firestore();
//   auth = firebase.auth();
//   functions = getFunctions();
// };
export const Firebase = () => {
  // Initialize Firebase
  let app
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
  } else {
    app = getApp()
  }

  const auth = getAuth(app);

  // Initialize Firebase Authentication with persistence
  // The way this is works is that the authentication state (when the user is logged in) is stored in the AsyncStorage,
  // which means that the user will be logged in even if the app is closed, and the user will be logged in even if the app is reopened.
  // const auth = getAuth(app, {
  //   persistence: getReactNativePersistence(AsyncStorage)
  // });

  //   const functions = getFunctions();
    
  // const callFn = async (fn, args) => {
  //   const callFn = httpsCallable(functions, fn);
  //   const result = await callFn(args);
  //   return result.data;
  // };

  const functions = getFunctions(app);
  // testing
  const callFn = async (fn: string, args: any) => {
      try {
        // Alert.alert('callF appn: ', JSON.stringify(app));
        // Alert.alert('callF auth: ', JSON.stringify(auth));
        // Alert.alert('callF funtion: ', JSON.stringify(functions));
        console.log('callFn: app', app);
        console.log('callFn: auth', auth);
        console.log('callFn: functions', functions);          
        const callFn = httpsCallable(functions, fn);          
        const result = await callFn(args);
        return result.data;
      }
      catch (error) {          
        console.error('Error:', JSON.stringify(error));
        Alert.alert('callF error: ', JSON.stringify(error));
      }        
    };


  // const callFn = async (fn, args) => {
  //   try {
  //       const callFn = firebase.functions().httpsCallable(fn);
  //       const result = await callFn(args);
  //       return result.data;
  //   } catch (e) {
  //       console.error("Error calling Cloud Function:", e.message);
  //       throw e;
  //   }
  // };

  const doSignInWithEmailAndPassword = async (auth: any, email: any, password: any) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return { result: true };
    } catch (e: any) {
      localStorage.setItem("loginError", e.code);
      return { error: e, result: false };
    }
  };

  const getCompanyForUser = async () => {
    try {
    const company = await callFn("companies-getCompanyForUser", {});
    console.log(company);
    Alert.alert('callF company: ', JSON.stringify(company));
    return company;
    }
    catch (e: any) {
      console.error("Error calling Cloud Function:", e.message);
      throw e;
    }
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

  const getProfiles = async (companyId: any) => {
    const profiles = await callFn("profiles-getProfilesByCompanyId", {
      companyId,
    });
    return profiles;
  };

  const getProfileImageUrl = async () => {
    const result = await callFn("profiles-getProfileImageUrl", {});
    return result
  }

  return {
    app,
    auth,
    functions,
    callFn,
    doSignInWithEmailAndPassword,
    getCompanyForUser,
    getCompanyByCompanyId,
    saveChat,
    getPastChats,
    getProfiles,
    getProfileImageUrl
  }
}
// export { auth }
// export const functions = getFunctions(app);
// export const db = getFirestore(app);
// export { getCompanyForUser, getCompanyByCompanyId, saveChat, getPastChats }