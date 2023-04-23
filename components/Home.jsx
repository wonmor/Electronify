import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  Animated as RNAnimated,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { connect } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import { getElementData } from "./utils/actions";

import * as WebBrowser from "expo-web-browser";

import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { FIREBASE_API_KEY, FIREBASE_APP_ID, FIREBASE_MESSAGING_SENDER_ID, FIREBASE_MEASUREMENT_ID, IOS_GUID, ANDROID_GUID, EXPO_GUID } from "@env";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
} from "react-native-reanimated";

import * as Haptics from "expo-haptics";
import * as SecureStore from 'expo-secure-store';

/*
ELECTRONIFY: A React Native App for Visualizing Quantum Mechanics
Developed and Designed by John Seong
--------------------------------------------------------------------
1. To download the dependencies, run npm install --force...
2. Run npx expo start --tunnel to start the app on public Wi-Fi...

TO-DO:
- Add an internet connection check [DONE]
- Add a loading screen [DONE]
- Add a "no internet connection" screen [DONE]
- Add Instances Support on ThreeJS (WebGL) [DONE]
- Add a time limit for the free trial
- Add a subscription screen
- Add a subscription payment screen
- Add a subscription confirmation screen
- Add a subscription cancellation screen
- Add a time detection ting for the "good afternoon" greeting
*/

WebBrowser.maybeCompleteAuthSession();

// Initialize Firebase
const firebaseConfig = {
  apiKey: FIREBASE_API_KEY,
  authDomain: "electronvisualized.firebaseapp.com",
  projectId: "electronvisualized",
  storageBucket: "electronvisualized.appspot.com",
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
};

getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const Circle = forwardRef(({ x, y, size, opacity }, ref) => {
  const circleRef = useRef(null);

  useImperativeHandle(ref, () => ({
    getNode: () => circleRef.current,
  }));

  return (
    <RNAnimated.View
      ref={circleRef}
      style={[
        styles.circle,
        { left: x, top: y, width: size, height: size, opacity },
      ]}
    />
  );
});

function Home(props) {
  const ANGLE = 10;
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotateZ: `${rotation.value}deg` }],
    };
  });

  const netInfo = useNetInfo();
  const isFocused = useIsFocused();
  const circlesRef = useRef([]);

  const auth = getAuth();

  const [name, setName] = useState("");
  const [waveAnim] = useState(new RNAnimated.Value(0));
  const [electronifyAnim] = useState(new RNAnimated.Value(0));

  useEffect(() => {
    startElectronifyAnimation();
  });

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
      // User is signed out
      const checkUserCredentials = async () => {
        const email = await SecureStore.getItemAsync('email');
        const password = await SecureStore.getItemAsync('password');
        const name = await SecureStore.getItemAsync('name');

        setName(name);

        if (email && password) {
          try {
            const userCredential = await signInWithEmailAndPassword(
              auth,
              email,
              password
            );

            const user = userCredential.user;
            setName(user.displayName);
            // User is successfully logged in
          } catch (error) {
            // Handle error
          }
        } else {
          // email and/or password do not exist in SecureStore
        }
      }
      checkUserCredentials();
  }, []);

  useEffect(() => {
    if (isFocused) {
      rotation.value = withRepeat(withTiming(10), 6, true);
      startArrowAnimation();
      startCircleAnimation();
    }
  }, [isFocused]);

  const handleScroll = (event) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    waveAnim.setValue(offsetY);
  };

  const waveStyle = [
    styles.wave,
    {
      transform: [
        {
          translateY: waveAnim.interpolate({
            inputRange: [-1, 0, 1],
            outputRange: [-1, 0, 1],
          }),
        },
      ],
    },
  ];

  const startElectronifyAnimation = () => {
    RNAnimated.timing(electronifyAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  const electronifyStyle = [
    { fontFamily: "Outfit_600SemiBold", fontSize: 40 },
    styles.appGenericText,
    {
      opacity: electronifyAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 1],
      }),
      transform: [
        {
          translateY: electronifyAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [-30, 0],
          }),
        },
      ],
    },
  ];

  const arrowAnim = useRef(new RNAnimated.Value(0)).current;
  const circleAnim = useRef(new RNAnimated.Value(0)).current;

  const startArrowAnimation = () => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(arrowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(arrowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startCircleAnimation = () => {
    RNAnimated.loop(
      RNAnimated.sequence([
        RNAnimated.timing(circleAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        RNAnimated.timing(circleAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start(() => {
    });
  };

  const circles = Array.from({ length: 40 }).map(() => ({
    x: Math.floor(Math.random() * 300),
    y: Math.floor(Math.random() * 500),
    size: Math.floor(Math.random() * 50) + 25,
    opacity: circleAnim,
  }));

  return (
    <ScrollView
      style={styles.parentContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 30 }}
      onScroll={(event) => {
        handleScroll(event);
      }}
      scrollEventThrottle={16}
      nestedScrollEnabled={true}
      {...waveStyle}
    >
      <View style={styles.container}>
        <View
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: [{ translateX: -150 }],
            zIndex: -10,
          }}
        >
          {circles.map((circle, index) => (
            <Circle
              key={index}
              {...circle}
              ref={(viewRef) => {
                circlesRef.current[index] = { ...circle, viewRef };
              }}
            />
          ))}
        </View>
        <Animated.View style={[styles.box, animatedStyle]}>
          <Image source={require("../assets/icon.png")} style={styles.icon} />
        </Animated.View>
        <RNAnimated.Text style={electronifyStyle}>
          <Text
            style={[
              { fontFamily: "Outfit_600SemiBold", fontSize: 40 },
              styles.appGenericText,
            ]}
          >
            <Text style={{ color: "#fecaca" }}>Electronify</Text>.
          </Text>
        </RNAnimated.Text>

        <Text
          style={[
            { fontFamily: "Outfit_400Regular", fontSize: 20 },
            styles.appGenericText,
          ]}
        >
          {name === null ? 
          "Bringing Quantum Mechanics to Everyday People."
          : `Welcome back, ${name}!`}
        </Text>

        <RNAnimated.View
          style={[
            styles.arrowContainer,
            {
              transform: [
                {
                  translateY: arrowAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 5],
                  }),
                },
              ],
            },
          ]}
        >
          <Ionicons name="chevron-down" size={28} color="#fff" />
        </RNAnimated.View>
      </View>

      <>
        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            if (netInfo.isConnected) {
              props.navigation.navigate("AtomSection");
            } else {
              alert("Please connect to the internet to use this feature.");
            }
            rotation.value = withSequence(
              withTiming(-10, { duration: 50 }),
              withRepeat(withTiming(ANGLE, { duration: 100 }), 6, true),
              withTiming(0, { duration: 50 })
            );
          }}
          style={[
            styles.appButtonContainer,
            { marginLeft: 20, marginRight: 20 },
          ]}
        >
          <Text
            style={[
              { fontFamily: "Outfit_600SemiBold" },
              styles.appButtonTextHeader,
              { color: "#fecaca" },
            ]}
          >
            Atomic
          </Text>
          <Text
            style={[{ fontFamily: "Outfit_400Regular" }, styles.appButtonText]}
          >
            Orbitals.
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

            if (netInfo.isConnected) {
              props.navigation.navigate("MoleculeSection");
            } else {
              alert("Please connect to the internet to use this feature.");
            }
            rotation.value = withSequence(
              withTiming(-10, { duration: 50 }),
              withRepeat(withTiming(ANGLE, { duration: 100 }), 6, true),
              withTiming(0, { duration: 50 })
            );
          }}
          style={[
            styles.appButtonContainer,
            { marginLeft: 20, marginRight: 20 },
          ]}
        >
          <Text
            style={[
              { fontFamily: "Outfit_600SemiBold" },
              styles.appButtonTextHeader,
            ]}
          >
            Molecular
          </Text>
          <Text
            style={[{ fontFamily: "Outfit_400Regular" }, styles.appButtonText]}
          >
            Orbitals.
          </Text>
        </TouchableOpacity>
      </>

      <Text
        style={[
          {
            fontFamily: "Outfit_400Regular",
            fontSize: 32,
            margin: 10,
            marginTop: 20,
          },
          styles.appGenericText,
        ]}
      >
        For students,{"\n"}by a student.
      </Text>

      <Text
        style={[
          {
            fontFamily: "Outfit_400Regular",
            fontSize: 14,
            margin: 10,
            marginTop: 20,
          },
          styles.appGenericText,
        ]}
      >
        Designed and Developed by John Seong.
      </Text>
    </ScrollView>
  );
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => ({
  getElementData: (item, type) => dispatch(getElementData(item, type)),
});

const styles = StyleSheet.create({
  parentContainer: {
    marginBottom: 30,
    zIndex: -1,
  },

  container: {
    margin: 20,
    padding: 15,
    backgroundColor: "rgba(79, 97, 125, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
  },

  icon: {
    width: 100,
    height: 100,
    margin: 5,
    borderRadius: 30,
    borderColor: "#fff",
    borderWidth: 1,
  },

  circle: {
    position: "absolute",
    backgroundColor: "rgba(28, 46, 74, 0.5)",
    borderRadius: 50,
  },

  borderlessContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: "rgba(28, 46, 74, 0.4)",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#1c2e4a",
  },

  borderlessContainerAlternative: {
    margin: 20,
    padding: 15,
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    borderRadius: 10,
    borderWidth: 5,
    borderColor: "#1c2e4a",
    backgroundColor: "rgba(28, 46, 74, 0.4)",
  },

  arrowContainer: {
    margin: 10,
    bottom: 0,
    alignSelf: "center",
  },

  scrollTextContainer: {
    bottom: 0,
    alignSelf: "center",
  },

  appGenericText: {
    textAlign: "center",
    color: "white",
    margin: 5,
  },

  appButtonContainer: {
    width: 200,
    alignSelf: "center",
    marginTop: 10,
    elevation: 8,
    backgroundColor: "#1c2e4a",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },

  appButtonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  },

  appButtonTextHeader: {
    fontSize: 30,
    color: "#bae6fd",
    alignSelf: "center",
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);
