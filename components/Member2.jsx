// import React, { useState, useEffect } from "react";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   TextInput,
//   TouchableWithoutFeedback,
//   Keyboard,
//   Alert,
//   Image,
// } from "react-native";
// import { appendToRecord } from "./utils/actions";
// import { connect } from "react-redux";

// import * as Google from "expo-auth-session/providers/google";
// import * as SecureStore from 'expo-secure-store';
// import * as Haptics from "expo-haptics";

// import Icon from "react-native-vector-icons/MaterialIcons";

// import { IOS_GUID, ANDROID_GUID, EXPO_GUID } from "@env";
// import { getAuth, fetchSignInMethodsForEmail, updateProfile, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

// const auth = getAuth();

// const Member2 = ({ route, navigation }) => {
//   const { isSigningUp } = route.params;

//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [request, response, promptAsync] = Google.useAuthRequest({
//     expoClientId: `${EXPO_GUID}.apps.googleusercontent.com`,
//     androidClientId: `${ANDROID_GUID}.apps.googleusercontent.com`,
//     iosClientId: `${IOS_GUID}.apps.googleusercontent.com`,
//   },
//   {
//     projectNameForProxy: "@wonmor/electronify",
//   });

//   useEffect(() => {
//     if (response?.type === "success") {
//       const credential = GoogleAuthProvider.credential(
//         null,
//         response.authentication.accessToken
//       );
//       signInWithCredential(auth, credential)
//         .then((userCredential) => {
//           const user = userCredential.user;
//           setIsLoggedIn(true);
//           appendToRecord(user);
//         })
//         .catch((error) => {
//           console.error(error);
//         });
//     }
//   }, [response]);

//   useEffect(() => {
//     if (isLoggedIn) {
//       navigation.navigate("Member");
//     }
//   }, [isLoggedIn]);

//   const handleSignIn = async () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

//     if (!email || !password) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     const trimmedEmail = email.toLowerCase().trim();
  
//    // Check if email is in the correct format
//    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
//     Alert.alert('Error', 'Invalid email format.');
//     return;
//   }

//     try {
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         trimmedEmail,
//         password
//       );
//       const user = userCredential.user;
//       await SecureStore.setItemAsync('email', trimmedEmail);
//       await SecureStore.setItemAsync('password', password);
//       await SecureStore.setItemAsync('name', name);

//       setIsLoggedIn(true);
//       appendToRecord(user);
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Invalid email or password.');
//     }
//   };
  
//   const handleSignUp = async () => {
//     Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

//     if (!email || !password || !confirmPassword) {
//       Alert.alert('Error', 'Please fill in all fields.');
//       return;
//     }

//     const trimmedEmail = email.toLowerCase().trim();
  
//     // Check if email is in the correct format
//     if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
//       Alert.alert('Error', 'Invalid email format.');
//       return;
//     }
  
//     // Check if password meets strength requirements
//     const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+~`=[\]{}|;':",./<>?])(?=.*[^\d\w\s]).{8,}$/;
//     if (!passwordRegex.test(password)) {
//       Alert.alert(
//         'Error',
//         'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.'
//       );
//       return;
//     }
  
//     if (password !== confirmPassword) {
//       Alert.alert('Error', 'Passwords do not match.');
//       return;
//     }
  
//     try {
//       const auth = getAuth();
//       // Check if email already exists
//       const methods = await fetchSignInMethodsForEmail(auth, trimmedEmail);
//       if (methods.length > 0) {
//         Alert.alert('Error', 'This email is already in use.');
//         return;
//       }
//       // Sign up the user
//       const userCredential = await createUserWithEmailAndPassword(
//         auth,
//         trimmedEmail,
//         password
//       );
//       const user = userCredential.user;
//       updateProfile(auth.currentUser, { displayName: name }); // Add this line
//       await SecureStore.setItemAsync('email', trimmedEmail);
//       await SecureStore.setItemAsync('password', password);
//       await SecureStore.setItemAsync('name', name);

//       setIsLoggedIn(true);
//       appendToRecord(user);
//     } catch (error) {
//       console.error(error);
//       Alert.alert('Error', 'Failed to create account.');
//     }
//   };

//   const dismissKeyboard = () => {
//     Keyboard.dismiss();
//   };
//   return (
//     <View style={{ flex: 1, backgroundColor: "white" }}>
//       <TouchableWithoutFeedback onPress={dismissKeyboard}>
//         <ScrollView
//           style={styles.parentContainer}
//           showsVerticalScrollIndicator={false}
//           contentContainerStyle={{ paddingBottom: 30 }}
//         >
//           <View style={styles.container}>
//               <>
//                 <Icon name="emoji-people" size={100} color="black" />
//                 <Text
//                   style={[
//                     styles.text,
//                     styles.heading,
//                     { fontFamily: "Outfit_600SemiBold" },
//                   ]}
//                 >
//                   {isSigningUp ? "Register." : "Login."}
//                 </Text>
//                 <View style={styles.form}>
//                   {isSigningUp && (
//                     <TextInput
//                     style={[styles.input, { fontFamily: "Outfit_400Regular" }]}
//                     placeholder="Name"
//                     placeholderTextColor={"grey"}
//                     autoCapitalize="words"
//                     value={name}
//                     onChangeText={setName}
//                   />   
//                 )}
//                   <TextInput
//                     style={[styles.input, { fontFamily: "Outfit_400Regular" }]}
//                     placeholder="Email"
//                     placeholderTextColor={"grey"}
//                     autoCapitalize="none"
//                     value={email}
//                     onChangeText={setEmail}
//                   />

//                   {!isSigningUp ? (
//                     <TextInput
//                       style={[
//                         styles.input,
//                         { fontFamily: "Outfit_400Regular" },
//                       ]}
//                       placeholder="Password"
//                       placeholderTextColor={"grey"}
//                       autoCapitalize="none"
//                       value={password}
//                       onChangeText={setPassword}
//                       secureTextEntry={true}
//                     />
//                   ) : (
//                     <>
//                       <TextInput
//                         style={[
//                           styles.input,
//                           { fontFamily: "Outfit_400Regular" },
//                         ]}
//                         placeholder="Enter Password"
//                         placeholderTextColor={"grey"}
//                         autoCapitalize="none"
//                         value={password}
//                         onChangeText={setPassword}
//                         secureTextEntry={true}
//                       />
//                       <TextInput
//                         style={[
//                           styles.input,
//                           { fontFamily: "Outfit_400Regular" },
//                         ]}
//                         placeholder="Confirm Password"
//                         placeholderTextColor={"grey"}
//                         autoCapitalize="none"
//                         value={confirmPassword}
//                         onChangeText={setConfirmPassword}
//                         secureTextEntry={true}
//                       />
//                     </>
//                   )}
//                   <TouchableOpacity
//                     style={styles.button}
//                     onPress={!isSigningUp ? handleSignIn : handleSignUp}
//                   >
//                     <Text
//                       style={[
//                         styles.buttonText,
//                         { fontFamily: "Outfit_400Regular" },
//                       ]}
//                     >
//                       {!isSigningUp ? "Sign in." : "Sign up."}
//                     </Text>
//                   </TouchableOpacity>
//                   <TouchableOpacity
//                     style={[styles.button, { borderColor: "#7c2d12" }]}
//                     disabled={!request}
//                     onPress={() => {
//                       Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//                       promptAsync();
//                     }}
//                   >
//                     <Text
//                       style={[
//                         styles.buttonText,
//                         { fontFamily: "Outfit_400Regular", color: "#7c2d12" },
//                       ]}
//                     >
//                       {!isSigningUp ? "Sign in" : "Sign up"} with Google.
//                     </Text>
//                   </TouchableOpacity>
//                 </View>
//               </>
//           </View>
//         </ScrollView>
//       </TouchableWithoutFeedback>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   parentContainer: {
//     zIndex: -1,
//     marginBottom: 20,
//   },

//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
//   text: {
//     fontSize: 20,
//     textAlign: "center",
//     margin: 10,
//     color: "black",
//   },
//   heading: {
//     fontSize: 40,
//   },
//   form: {
//     width: "100%",
//     marginTop: 30,
//     alignItems: "center",
//   },
//   input: {
//     width: "80%",
//     height: 50,
//     fontSize: 16,
//     color: "black",
//     borderWidth: 1,
//     borderColor: "#1c1917",
//     marginBottom: 10,
//     paddingLeft: 10,
//     borderRadius: 10,
//   },
//   button: {
//     width: 200,
//     height: 50,
//     borderColor: "black",
//     borderWidth: 1,
//     alignItems: "center",
//     justifyContent: "center",
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   buttonText: {
//     fontSize: 18,
//     color: "black",
//   },
//   footer: {
//     flexDirection: "row",
//     justifyContent: "center",
//     alignItems: "center",
//     marginTop: 20,
//   },
//   link: {
//     marginLeft: 5,
//     color: "#2e7d32",
//     textDecorationLine: "underline",
//   },
// });

// const mapStateToProps = (state) => {
//   return state;
// };

// const mapDispatchToProps = (dispatch) => ({
//   appendToRecord: (payload) => dispatch(appendToRecord(payload)),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Member2);