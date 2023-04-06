import React, { useEffect } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

import firebase from 'firebase/compat/app';
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { FIREBASE_API_KEY, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_APP_ID, FIREBASE_MEASUREMENT_ID } from '@env'

// Initialize Firebase: https://stackoverflow.com/questions/69814654/firebase-package-was-successfully-found-however-this-package-itself-specifie
const firebaseConfig = {
    apiKey: FIREBASE_API_KEY,
    authDomain: "electronvisualized.firebaseapp.com",
    projectId: "electronvisualized",
    storageBucket: "electronvisualized.appspot.com",
    messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
    appId: FIREBASE_APP_ID,
    measurementId: FIREBASE_MEASUREMENT_ID
};

const Member = () => {
    let firebaseApp;

    useEffect(() => {
        if (!firebase.apps.length) {
            firebaseApp = firebase.initializeApp(firebaseConfig)
        }

        const auth = getAuth(firebaseApp);

        onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("User is signed in.");
            } else {
                console.log("User is signed out.");
            }
        });
    }, []);

  const handleSignIn = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      await getAuth(firebaseApp).signInWithPopup(provider);
      console.log("User signed in successfully.");
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.text, styles.heading, { fontFamily: "Outfit_600SemiBold" }]}>
        You are currently on a{" "}
        <Text style={[styles.highlight, { fontFamily: "Outfit_600SemiBold" }]}>Free</Text> Tier.
      </Text>
      <Button style={{ fontFamily: "Outfit_400Regular" }} title="Sign in with Google" onPress={handleSignIn} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  heading: {
    fontSize: 40,
    fontFamily: "Outfit_600SemiBold",
  },
  subtitle: {
    fontFamily: "Outfit_400Regular",
  },
  highlight: {
    fontFamily: "Outfit_600SemiBold",
    color: "#2e7d32",
  },
});

export default Member;
