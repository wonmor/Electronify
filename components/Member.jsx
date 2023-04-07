import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert
} from "react-native";
import { appendToRecord } from "./utils/actions";

import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_APP_ID,
  IOS_GUID,
  ANDROID_GUID
} from "@env";

const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  appId: FIREBASE_APP_ID,
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth();

WebBrowser.maybeCompleteAuthSession();

// https://docs.expo.dev/guides/google-authentication/

const Member = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [token, setToken] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: `${ANDROID_GUID}.apps.googleusercontent.com`,
    iosClientId: `${IOS_GUID}.apps.googleusercontent.com`,
  });

  const getUserInfo = async () => {
    try {
      const response = await fetch(
        "https://www.googleapis.com/userinfo/v2/me",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const user = await response.json();
      appendToRecord(user);

    } catch (error) {
      // Add your own error handler here
    }
  };

  useEffect(() => {
    if (response?.type === "success") {
      setToken(response.authentication.accessToken);
      getUserInfo();
    }
  }, [response, token]);

  const handleEmailSignIn = async () => {
    // Validate email format
    const isValidEmail = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(email);
    if (!isValidEmail) {
      Alert.alert("Invalid email format");
      return;
    }

    try {
      await auth.signInWithEmailAndPassword(email, password);
      console.log("User signed in successfully.");
    } catch (error) {
        Alert.alert("Invalid email or password");
    }
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.container}>
        <Text
          style={[
            styles.text,
            styles.heading,
            { fontFamily: "Outfit_600SemiBold" },
          ]}
        >
          You are currently on a <Text style={[styles.highlight]}>Free</Text>{" "}
          Tier.
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
          <TextInput
            style={[styles.input, { fontFamily: "Outfit_400Regular" }]}
            placeholder="Password"
            placeholderTextColor={"grey"}
            autoCapitalize="none"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={true}
          />
          <TouchableOpacity style={styles.button} onPress={handleEmailSignIn}>
            <Text
              style={[styles.buttonText, { fontFamily: "Outfit_600SemiBold" }]}
            >
              Sign in with email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: "#c23b22" }]}
            disabled={!request}
            onPress={() => {
                promptAsync();
            }}
          >
            <Text
              style={[styles.buttonText, { fontFamily: "Outfit_600SemiBold" }]}
            >
              Sign in with Google
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 20,
    marginRight: 20,
  },
  text: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  heading: {
    fontSize: 40,
  },
  highlight: {
    color: "#2e7d32",
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
    backgroundColor: "#fff",
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  button: {
    width: "80%",
    height: 50,
    backgroundColor: "#2e7d32",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
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

export default connect(mapStateToProps, mapDispatchToProps)(Member);
