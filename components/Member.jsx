// import React, {
//   useState,
//   useRef,
//   useEffect,
//   forwardRef,
//   useImperativeHandle,
// } from "react";
// import {
//   TouchableOpacity,
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Animated as RNAnimated,
// } from "react-native";
// import { useIsFocused } from "@react-navigation/native";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
// import { connect } from "react-redux";
// import { useNetInfo } from "@react-native-community/netinfo";
// import { getElementData } from "./utils/actions";
// import {
//   useSharedValue,
//   useAnimatedStyle,
//   withSequence,
//   withTiming,
//   withRepeat,
// } from "react-native-reanimated";

// import * as Haptics from "expo-haptics";
// import * as SecureStore from "expo-secure-store";

// /*
//   ELECTRONIFY: A React Native App for Visualizing Quantum Mechanics
//   Developed and Designed by John Seong
//   --------------------------------------------------------------------
//   1. To download the dependencies, run npm install --force...
//   2. Run npx expo start --tunnel to start the app on public Wi-Fi...
  
//   TO-DO:
//   - Add an internet connection check [DONE]
//   - Add a loading screen [DONE]
//   - Add a "no internet connection" screen [DONE]
//   - Add Instances Support on ThreeJS (WebGL) [DONE]
//   - Add a time limit for the free trial
//   - Add a subscription screen
//   - Add a subscription payment screen
//   - Add a subscription confirmation screen
//   - Add a subscription cancellation screen
//   - Add a time detection ting for the "good afternoon" greeting
//   */

// const auth = getAuth();

// const Circle = forwardRef(({ x, y, size, opacity }, ref) => {
//   const circleRef = useRef(null);

//   useImperativeHandle(ref, () => ({
//     getNode: () => circleRef.current,
//   }));

//   return (
//     <RNAnimated.View
//       ref={circleRef}
//       style={[
//         styles.circle,
//         { left: x, top: y, width: size, height: size, opacity },
//       ]}
//     />
//   );
// });

// function Member(props) {
//   const ANGLE = 10;
//   const rotation = useSharedValue(0);

//   const animatedStyle = useAnimatedStyle(() => {
//     return {
//       transform: [{ rotateZ: `${rotation.value}deg` }],
//     };
//   });

//   const netInfo = useNetInfo();
//   const isFocused = useIsFocused();
//   const circlesRef = useRef([]);

//   const [loggedIn, setLoggedIn] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         setLoggedIn(true);
//       } else {
//         setLoggedIn(false);
//       }
//     });
//     return unsubscribe;
//   }, []);

//   useEffect(() => {
//     if (isFocused) {
//       rotation.value = withRepeat(withTiming(10), 6, true);
//       startCircleAnimation();
//     }
//   }, [isFocused]);

//   const handleLogOut = async () => {
//     try {
//       // delete email and password from SecureStore
//       await SecureStore.deleteItemAsync("email");
//       await SecureStore.deleteItemAsync("password");
//       await SecureStore.deleteItemAsync("name");
  
//       // sign out the user
//       await auth.signOut();
//       setLoggedIn(false);
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Error", "Failed to log out.");
//     }
//   };

//   const circleAnim = useRef(new RNAnimated.Value(0)).current;

//   const startCircleAnimation = () => {
//     RNAnimated.loop(
//       RNAnimated.sequence([
//         RNAnimated.timing(circleAnim, {
//           toValue: 1,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//         RNAnimated.timing(circleAnim, {
//           toValue: 0,
//           duration: 2000,
//           useNativeDriver: true,
//         }),
//       ])
//     ).start(() => {
//     });
//   };

//   const circles = Array.from({ length: 40 }).map(() => ({
//     x: Math.floor(Math.random() * 300),
//     y: Math.floor(Math.random() * 500),
//     size: Math.floor(Math.random() * 50) + 25,
//     opacity: circleAnim,
//   }));

//   return (
//     <ScrollView
//       style={styles.parentContainer}
//       showsVerticalScrollIndicator={false}
//       contentContainerStyle={{ flexGrow: 1 }}
//     >
//       <View style={styles.container}>
//         <View
//           style={{
//             position: "absolute",
//             top: 0,
//             left: "50%",
//             transform: [{ translateX: -150 }],
//             zIndex: -10,
//           }}
//         >
//           {circles.map((circle, index) => (
//             <Circle
//               key={index}
//               {...circle}
//               ref={(viewRef) => {
//                 circlesRef.current[index] = { ...circle, viewRef };
//               }}
//             />
//           ))}
//         </View>
//         <>
//           <Text
//             style={[
//               { fontFamily: "DMSerifDisplay_400Regular", fontSize: 40 },
//               styles.appGenericText,
//             ]}
//           >
//             Introducing Electronify Tenure.
//           </Text>
//         </>

//         <Text
//           style={[
//             { fontFamily: "Outfit_400Regular", fontSize: 20 },
//             styles.appGenericText,
//           ]}
//         >
//           A New Way to Learn Quantum Mechanics.
//         </Text>
//       </View>

//       <>
//         {loggedIn ? (
//           <TouchableOpacity
//             onPress={() => {
//               Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
//               handleLogOut();
//             }}
//             style={[
//               styles.appButtonContainer,
//               { marginLeft: 20, marginRight: 20 },
//             ]}
//           >
//             <Text
//                 style={[
//                   { fontFamily: "Outfit_400Regular" },
//                   styles.appButtonTextHeader,
//                 ]}
//               >
//                 Thanks for visiting.
//               </Text>

//             <Text
//                 style={[
//                   { fontFamily: "DMSerifDisplay_400Regular", marginTop: 10 },
//                   styles.appButtonText,
//                 ]}
//               >
//               Sign out.
//             </Text>
//           </TouchableOpacity>
//         ) : (
//           <>
//             <TouchableOpacity
//               onPress={() => {
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

//                 if (netInfo.isConnected) {
//                   props.navigation.navigate("Member2", { isSigningUp: true });
//                 } else {
//                   alert("Please connect to the internet to use this feature.");
//                 }
//                 rotation.value = withSequence(
//                   withTiming(-10, { duration: 50 }),
//                   withRepeat(withTiming(ANGLE, { duration: 100 }), 6, true),
//                   withTiming(0, { duration: 50 })
//                 );
//               }}
//               style={[
//                 styles.appButtonContainer,
//                 { marginLeft: 20, marginRight: 20 },
//               ]}
//             >
//               <Text
//                 style={[
//                   { fontFamily: "Outfit_400Regular" },
//                   styles.appButtonTextHeader,
//                 ]}
//               >
//                 {`\u2022 Unlimited Access to All Content.`}
//               </Text>

//               <Text
//                 style={[
//                   { fontFamily: "Outfit_400Regular", marginTop: 10 },
//                   styles.appButtonTextHeader,
//                 ]}
//               >
//                 {`\u2022 Shared Across All Devices.`}
//               </Text>

//               <Text
//                 style={[
//                   { fontFamily: "DMSerifDisplay_400Regular", marginTop: 10 },
//                   styles.appButtonText,
//                 ]}
//               >
//                 Sign up.
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => {
//                 Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

//                 if (netInfo.isConnected) {
//                   props.navigation.navigate("Member2", { isSigningUp: false });
//                 } else {
//                   alert("Please connect to the internet to use this feature.");
//                 }
//                 rotation.value = withSequence(
//                   withTiming(-10, { duration: 50 }),
//                   withRepeat(withTiming(ANGLE, { duration: 100 }), 6, true),
//                   withTiming(0, { duration: 50 })
//                 );
//               }}
//               style={[
//                 styles.appButtonContainer,
//                 { marginLeft: 20, marginRight: 20 },
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.appButtonText,
//                   { fontFamily: "Outfit_400Regular", fontSize: 20 },
//                 ]}
//               >
//                 or Sign in.
//               </Text>
//             </TouchableOpacity>
//           </>
//         )}
//       </>
//     </ScrollView>
//   );
// }

// const mapStateToProps = (state) => {
//   return state;
// };

// const mapDispatchToProps = (dispatch) => ({
//   getElementData: (item, type) => dispatch(getElementData(item, type)),
// });

// const styles = StyleSheet.create({
//   parentContainer: {
//     backgroundColor: "white",
//     zIndex: -1,
//   },

//   container: {
//     margin: 20,
//     padding: 15,
//     borderWidth: 1,
//     borderColor: "#334155",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     borderRadius: 10,
//   },

//   icon: {
//     width: 100,
//     height: 100,
//     margin: 5,
//   },

//   circle: {
//     position: "absolute",
//     backgroundColor: "rgba(28, 46, 74, 0.05)",
//     borderRadius: 50,
//   },

//   borderlessContainer: {
//     margin: 20,
//     padding: 15,
//     backgroundColor: "rgba(28, 46, 74, 0.4)",
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     borderRadius: 10,
//     borderWidth: 5,
//     borderColor: "#1c2e4a",
//   },

//   borderlessContainerAlternative: {
//     margin: 20,
//     padding: 15,
//     alignItems: "center",
//     justifyContent: "center",
//     textAlign: "center",
//     borderRadius: 10,
//     borderWidth: 5,
//     borderColor: "#1c2e4a",
//     backgroundColor: "rgba(28, 46, 74, 0.4)",
//   },

//   arrowContainer: {
//     margin: 10,
//     bottom: 0,
//     alignSelf: "center",
//   },

//   scrollTextContainer: {
//     bottom: 0,
//     alignSelf: "center",
//   },

//   appGenericText: {
//     textAlign: "center",
//     color: "black",
//     margin: 5,
//   },

//   appButtonContainer: {
//     width: 200,
//     alignSelf: "center",
//     marginTop: 10,
//     elevation: 8,
//     borderWidth: 1,
//     borderColor: "black",
//     backgroundColor: "white",
//     borderRadius: 10,
//     paddingVertical: 10,
//     paddingHorizontal: 12,
//   },

//   appButtonText: {
//     fontSize: 32,
//     color: "black",
//     alignSelf: "center",
//   },

//   appButtonTextHeader: {
//     fontSize: 18,
//     color: "black",
//     alignSelf: "center",
//   },
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Member);
