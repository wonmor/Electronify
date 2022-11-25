import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { useFonts, Outfit_400Regular, Outfit_600SemiBold } from '@expo-google-fonts/outfit';

export default function Home ({ navigation }) {
    let [fontsLoaded] = useFonts({
        Outfit_400Regular,
        Outfit_600SemiBold,
    });

    if (!fontsLoaded) {
      return null;
    }
    
    return (
        <>
          <View style={styles.container}>
            <Text style={[{ fontFamily: 'Outfit_600SemiBold', fontSize: 40 }, styles.appGenericText]}>
              Welcome to Electronify.
            </Text>

            <Text style={[{ fontFamily: 'Outfit_400Regular', fontSize: 20 }, styles.appGenericText]}>
              Visualizing Quantum Mechanics. Reimagined.
            </Text>
          </View>

          <View style={styles.borderlessContainer}>
            <Text style={[{ fontFamily: 'Outfit_600SemiBold', fontSize: 40 }, styles.appGenericText]}>
              Molecules.
            </Text>

            <TouchableOpacity onPress={() =>
                navigation.navigate('Featurer')
              } style={styles.appButtonContainer}>
              <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.appButtonText]}>Hydrogen Gas</Text>
            </TouchableOpacity>
          </View>

          <Text style={[{ fontFamily: 'Outfit_400Regular', fontSize: 15 }, styles.appGenericText]}>
            Designed and Developed by John Seong.
          </Text>
        </>
    );
}

const styles = StyleSheet.create({
  container: {
    margin: 20,
    padding: 15,
    backgroundColor: '#4f617d',
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'center',
    borderRadius: 10,
  },

  borderlessContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#1c2e4a',
  },
  
  appGenericText: {
    textAlign: "center",
    color: "white",
    margin: 5,
  },

  appButtonContainer: {
    margin: 10,
    elevation: 8,
    backgroundColor: "#1c2e4a",
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 12
  },

  appButtonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
  }
});