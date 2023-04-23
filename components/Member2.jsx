import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Image,
} from "react-native";
import { appendToRecord } from "./utils/actions";
import { connect } from "react-redux";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";

import Icon from "react-native-vector-icons/MaterialIcons";

import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_MEASUREMENT_ID, IOS_GUID, ANDROID_GUID, EXPO_GUID } from "@env";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, fetchSignInMethodsForEmail, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const auth = getAuth();

const Member2 = ({ route }) => {
  const { isSigningUp } = route.params;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [token, setToken] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: `${EXPO_GUID}.apps.googleusercontent.com`,
    androidClientId: `${ANDROID_GUID}.apps.googleusercontent.com`,
    iosClientId: `${IOS_GUID}.apps.googleusercontent.com`,
  });

  useEffect(() => {
    if (response?.type === "success") {
      const credential = GoogleAuthProvider.credential(
        null,
        response.authentication.accessToken
      );
      signInWithCredential(auth, credential)
        .then((userCredential) => {
          const user = userCredential.user;
          setName(user.displayName);
          setIsLoggedIn(true);
          appendToRecord(user);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [response]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Check if email is in the correct format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setName(user.displayName);
      setIsLoggedIn(true);
      appendToRecord(user);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Invalid email or password.");
    }
  };
  
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Check if email is in the correct format
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      Alert.alert("Error", "Invalid email format.");
      return;
    }
  
    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
  
    try {
      const auth = getAuth();
      // Check if email already exists
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length > 0) {
        Alert.alert("Error", "This email is already in use.");
        return;
      }
      // Sign up the user
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setName(user.displayName);
      setIsLoggedIn(true);
      appendToRecord(user);
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to create account.");
    }
  };
  

  const handleLogOut = () => {
    auth.signOut()
      .then(() => {
        setIsLoggedIn(false);
        setName("");
      })
      .catch((error) => {
        console.error(error);
        Alert.alert("Error", "Failed to log out.");
      });
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <TouchableWithoutFeedback onPress={dismissKeyboard}>
        <ScrollView
          style={styles.parentContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <View style={styles.container}>
            {isLoggedIn ? (
              <>
                <Text
                  style={[
                    styles.text,
                    styles.heading,
                    { fontFamily: "Outfit_600SemiBold" },
                  ]}
                >
                  Welcome, {name}
                </Text>
                <TouchableOpacity style={styles.button} onPress={handleLogOut}>
                  <Text
                    style={[
                      styles.buttonText,
                      { fontFamily: "Outfit_600SemiBold" },
                    ]}
                  >
                    Log out
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Icon name="emoji-people" size={100} color="black" />
                <Text
                  style={[
                    styles.text,
                    styles.heading,
                    { fontFamily: "Outfit_600SemiBold" },
                  ]}
                >
                  {isSigningUp ? "Register." : "Login."}
                </Text>
                <View style={styles.form}>
                  <TextInput
                    style={[styles.input, { fontFamily: "Outfit_400Regular" }]}
                    placeholder="Email"
                    placeholderTextColor={"grey"}
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />

                  {!isSigningUp ? (
                    <TextInput
                      style={[
                        styles.input,
                        { fontFamily: "Outfit_400Regular" },
                      ]}
                      placeholder="Password"
                      placeholderTextColor={"grey"}
                      autoCapitalize="none"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={true}
                    />
                  ) : (
                    <>
                      <TextInput
                        style={[
                          styles.input,
                          { fontFamily: "Outfit_400Regular" },
                        ]}
                        placeholder="Enter Password"
                        placeholderTextColor={"grey"}
                        autoCapitalize="none"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry={true}
                      />
                      <TextInput
                        style={[
                          styles.input,
                          { fontFamily: "Outfit_400Regular" },
                        ]}
                        placeholder="Confirm Password"
                        placeholderTextColor={"grey"}
                        autoCapitalize="none"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry={true}
                      />
                    </>
                  )}
                  <TouchableOpacity
                    style={styles.button}
                    onPress={!isSigningUp ? handleSignIn : handleSignUp}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { fontFamily: "Outfit_400Regular" },
                      ]}
                    >
                      {!isSigningUp ? "Sign in." : "Sign up."}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.button, { borderColor: "#7c2d12" }]}
                    disabled={!request}
                    onPress={() => {
                      promptAsync();
                    }}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        { fontFamily: "Outfit_400Regular", color: "#7c2d12" },
                      ]}
                    >
                      {!isSigningUp ? "Sign in" : "Sign up"} with Google.
                    </Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    zIndex: -1,
    marginBottom: 20,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    color: "black",
  },
  heading: {
    fontSize: 40,
  },
  form: {
    width: "100%",
    marginTop: 30,
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 50,
    fontSize: 16,
    color: "black",
    borderWidth: 1,
    borderColor: "#1c1917",
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  button: {
    width: 200,
    height: 50,
    borderColor: "black",
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "black",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  link: {
    marginLeft: 5,
    color: "#2e7d32",
    textDecorationLine: "underline",
  },
});

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => ({
  appendToRecord: (payload) => dispatch(appendToRecord(payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Member2);