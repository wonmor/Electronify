import Featurer from './components/Featurer';
import Home from './components/Home';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { configureStore } from 'redux';

import rootReducer from './src/utils/reducers';

/*
ELECTRONIFY: A React Native App for Visualizing Quantum Mechanics
Developed and Designed by John Seong
--------------------------------------------------------------------
Business Model:
Let the user use the app for free for a limited time, and then charge them a subscription fee.
*/

const store = configureStore({ reducer: rootReducer, middleware: [thunk] });

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
       <Stack.Navigator
          screenOptions={{
            headerStyle: { elevation: 0, backgroundColor: '#1c2e4a'},
            headerTitleStyle: {
              color: 'white',
              fontFamily: 'Outfit_600SemiBold',
              fontSize: 30,
            },
            headerTintColor: 'white',
            contentStyle: { backgroundColor: '#394d6d' },
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{ title: 'Good Afternoon.' }}
        />
        <Stack.Screen
          name="Featurer"
          component={Featurer}
          options={{ title: 'Spotlight.' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <AppNavigator />
    </Provider>
  );
}