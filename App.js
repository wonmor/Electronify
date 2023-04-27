import React, { useEffect } from "react";
import { BackHandler } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import thunk from "redux-thunk";
import rootReducer from "./components/utils/reducers";

import Home from "./components/Home";
import Featurer from "./components/Featurer";
import Featurer2 from "./components/Featurer2";
import AtomSection from "./components/AtomSection";
import MoleculeSection from "./components/MoleculeSection";
import Member from "./components/Member";
import Member2 from "./components/Member2";
import MolarMass from "./components/MolarMass";

import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/MaterialCommunityIcons";

import {
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
} from "@expo-google-fonts/outfit";

import {
  PlayfairDisplay_400Regular,
  PlayfairDisplay_600SemiBold,
} from "@expo-google-fonts/playfair-display";

import {
  DMSerifDisplay_400Regular,
  DMSerifDisplay_400Regular_Italic,
} from "@expo-google-fonts/dm-serif-display";

const store = configureStore({ reducer: rootReducer, middleware: [thunk] });
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const MyStack = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { elevation: 0, backgroundColor: "#1c2e4a" },
          headerTitleStyle: {
            fontFamily: "Outfit_600SemiBold",
            fontSize: 30,
          },
          headerTintColor: "white",
          contentStyle: { backgroundColor: "#394d6d" },
          headerBackTitle: "",
          // Add this option to disable the default back button
          headerLeft: () => null,
        }}
      >
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: `Good ${
              new Date().getHours() < 12 ? "Morning" : "Afternoon"
            }.`,
          }}
        />
        <Stack.Screen
          name="AtomSection"
          component={AtomSection}
          options={{ title: "Atoms." }}
        />
        <Stack.Screen
          name="MoleculeSection"
          component={MoleculeSection}
          options={{ title: "Molecules." }}
        />
        <Stack.Screen
          name="Featurer"
          component={Featurer}
          options={{ title: "Spotlight." }}
        />
        <Stack.Screen
          name="Featurer2"
          component={Featurer2}
          options={{ title: "Spotlight." }}
        />
        <Stack.Screen
          name="Member"
          component={Member}
          options={{ title: "Member." }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const MemberStack = () => {
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { elevation: 0, backgroundColor: "black" },
          headerTitleStyle: {
            fontFamily: "Outfit_600SemiBold",
            fontSize: 30,
          },
          headerTintColor: "white",
          contentStyle: { backgroundColor: "#394d6d" },
          headerBackTitle: "",
          // Add this option to disable the default back button
          headerLeft: () => null,
        }}
      >
        <Stack.Screen
          name="Member"
          component={Member}
          options={{ title: "Member." }}
        />
        <Stack.Screen
          name="Member2"
          component={Member2}
          options={{ title: "Account." }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const App = () => {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
    PlayfairDisplay_400Regular,
    PlayfairDisplay_600SemiBold,
    DMSerifDisplay_400Regular,
    DMSerifDisplay_400Regular_Italic,
  });

  useEffect(() => {
    const backAction = () => {
      BackHandler.exitApp();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer independent={true}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerStyle: { elevation: 0, backgroundColor: "#1c2e4a" },
            headerTitleStyle: {
              color: "white",
              fontFamily: "Outfit_600SemiBold",
              fontSize: 30,
            },
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;

              if (route.name === "Orbitals.") {
                iconName = focused ? "orbit" : "orbit";
              } else if (route.name === "Molar Mass.") {
                iconName = focused ? "flask" : "flask";
              } else if (route.name === "Member.") {
                iconName = focused ? "wallet-membership" : "wallet-membership";
              }

              // You can return any component that you like here!
              return route.name === "Molar Mass." ? (
                <Icon name={iconName} size={size} color={color} />
              ) : (
                <Icon2 name={iconName} size={size} color={color} />
              );
            },
            tabBarLabelStyle: {
              fontFamily: "Outfit_600SemiBold",
              marginTop: -10,
              fontSize: 14, // or any other font size you want
            },
            contentStyle: { backgroundColor: "#394d6d" },
            tabBarActiveTintColor: "#2e7d32",
            tabBarInactiveTintColor: "black",
          })}
          initialRouteName="Orbitals."
        >
          {/* <Tab.Screen
            name="Member."
            options={{ headerShown: false }}
            component={MemberStack}
          /> */}
          <Tab.Screen
            name="Orbitals."
            options={{ headerShown: false, unmountOnBlur: true }}
            component={MyStack}
          />
          <Tab.Screen
            name="Molar Mass."
            options={{ headerShown: true }}
            component={MolarMass}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
