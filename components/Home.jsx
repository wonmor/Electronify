import React, { useState } from 'react';

import { TouchableOpacity, StyleSheet, Text, View, ActivityIndicator, ScrollView } from 'react-native';
import { connect } from 'react-redux';

import { useNetInfo } from "@react-native-community/netinfo";

import { getElementData } from './utils/actions';

import Table from './Table';

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

function Home(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [molecules, setMolecules] = useState([
        { name: "Hydrogen Gas", formula: "H2", type: "molecule" },
        { name: "Water", formula: "H2O", type: "molecule" },
    ]);
    
    const netInfo = useNetInfo();

    const fetchElementData = async (item, type) => {
        await props.getElementData(item, type);
        // Async function will ensure that it returns a promise...
    };

    const ElementButton = (nestedProps) => {
      return (
        <TouchableOpacity  
          onPress={() => {
              if (netInfo.isConnected) {
                setIsLoading(true);
                fetchElementData(nestedProps.formula, nestedProps.type)
                .then(() => {
                  // Wait for the Redux state update...
                  setTimeout(() => {
                    props.navigation.navigate('Featurer');
                    setIsLoading(false);
                  }, 500);
                });
              } else {
                alert("Please connect to the internet to use this feature.");
              }
            }
          }
          style={styles.appButtonContainer}>
          <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.appButtonTextHeader]}>{nestedProps.formula}</Text>
          <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.appButtonText]}>{nestedProps.elementName}</Text>
        </TouchableOpacity>
      );
    };

    const MoleculeSection = () => {
      return (
        <View style={styles.borderlessContainer}>
          <Text style={[{ fontFamily: 'Outfit_600SemiBold', fontSize: 40 }, styles.appGenericText]}>
            Molecules.
          </Text>

          {molecules.map(molecule => (
            <ElementButton elementName={molecule.name} formula={molecule.formula} type={molecule.type} key={molecule.name} />
          ))}
        </View>
      );
    }

    const AtomSection = () => {
      return (
        <View style={styles.borderlessContainerAlternative}>
          <Text style={[{ fontFamily: 'Outfit_600SemiBold', fontSize: 40 }, styles.appGenericText]}>
            Atoms.
          </Text>

          <Table />
        </View>
      );
    }

    return (
        <ScrollView style={styles.parentContainer}>
          <View style={styles.container}>
            <Text style={[{ fontFamily: 'Outfit_600SemiBold', fontSize: 40 }, styles.appGenericText]}>
              Welcome to <Text style={{ color: '#fecaca' }}>Electronify</Text>.
            </Text>

            <Text style={[{ fontFamily: 'Outfit_400Regular', fontSize: 20 }, styles.appGenericText]}>
              Visualizing Quantum Mechanics. Reimagined.
            </Text>
          </View>

          {!isLoading ? (
            <>
              <MoleculeSection />
              <AtomSection />
            </>
          ) : (
            <View style={styles.borderlessContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          <Text style={[{ fontFamily: 'Outfit_400Regular', fontSize: 15 }, styles.appGenericText]}>
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
  },

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

  borderlessContainerAlternative: {
    margin: 20,
    padding: 15,
    backgroundColor: "transparent",
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#1c2e4a',
    backgroundColor: '#1c2e4a'
  },
  
  appGenericText: {
    textAlign: "center",
    color: "white",
    margin: 5,
  },

  appButtonContainer: {
    marginTop: 10,
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
  },

  appButtonTextHeader: {
    fontSize: 30,
    color: "#bae6fd",
    alignSelf: "center",
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);