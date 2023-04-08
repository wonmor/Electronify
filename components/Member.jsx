import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
} from "react-native";
import { appendToRecord } from "./utils/actions";
import { connect } from "react-redux";

import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import * as AuthSession from "expo-auth-session";

import { IOS_GUID, ANDROID_GUID, EXPO_GUID } from "@env";

WebBrowser.maybeCompleteAuthSession();

const Member = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [token, setToken] = useState("");
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: `${EXPO_GUID}.apps.googleusercontent.com`,
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
      setName(user.name);
      setIsLoggedIn(true);
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

  const handleSignIn = async () => {
    // Add your sign in logic here
  };

  const handleSignUp = async () => {
    // Add your sign up logic here
  };

  const handleLogOut = () => {
    // Add your log out logic here
    setIsLoggedIn(false);
    setName("");
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };
  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
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
            <Text
              style={[
                styles.text,
                styles.heading,
                { fontFamily: "Outfit_600SemiBold" },
              ]}
            >
              You are currently on a{" "}
              <Text style={[styles.highlight]}>Free</Text> Tier.
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
              <TouchableOpacity style={styles.button} onPress={handleSignIn}>
                <Text
                  style={[
                    styles.buttonText,
                    { fontFamily: "Outfit_600SemiBold" },
                  ]}
                >
                  Sign in
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
                  style={[
                    styles.buttonText,
                    { fontFamily: "Outfit_600SemiBold" },
                  ]}
                >
                  Sign in with Google
                </Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text
                  style={[
                    styles.buttonText,
                    { fontFamily: "Outfit_600SemiBold" },
                  ]}
                >
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>
          </>
        )}
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
