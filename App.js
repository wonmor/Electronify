import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import rootReducer from './components/utils/reducers';
import Home from './components/Home';
import Featurer from './components/Featurer';
import Featurer2 from './components/Featurer2';
import AtomSection from './components/AtomSection';
import MoleculeSection from './components/MoleculeSection';

import {
  useFonts,
  Outfit_400Regular,
  Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';

const store = configureStore({ reducer: rootReducer, middleware: [thunk] });
const Stack = createNativeStackNavigator();

const App = () => {
  const [fontsLoaded] = useFonts({
    Outfit_400Regular,
    Outfit_600SemiBold,
  });

  useEffect(() => {
    // Any global initialization code can go here
  }, []);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { elevation: 0, backgroundColor: '#1c2e4a' },
            headerTitleStyle: {
              fontFamily: 'Outfit_600SemiBold',
              fontSize: 30,
            },
            headerTintColor: 'white',
            contentStyle: { backgroundColor: '#394d6d' },
          }}>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              title: `Good ${new Date().getHours() < 12 ? 'Morning' : 'Afternoon'}.`,
            }}
          />
          <Stack.Screen
            name="AtomSection"
            component={AtomSection}
            options={{ title: 'Atoms.' }}
          />
          <Stack.Screen
            name="MoleculeSection"
            component={MoleculeSection}
            options={{ title: 'Molecules.' }}
          />
          <Stack.Screen
            name="Featurer"
            component={Featurer}
            options={{ title: 'Spotlight.' }}
          />
          <Stack.Screen
            name="Featurer2"
            component={Featurer2}
            options={{ title: 'Spotlight.' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
