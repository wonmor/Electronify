import React, { useState, useRef, useEffect } from 'react';
import { TouchableOpacity, StyleSheet, Text, Image, View, ActivityIndicator, ScrollView, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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

const Circle = ({ x, y, size }) => (
  <View style={[styles.circle, { left: x, top: y, width: size, height: size }]} />
);

function Home(props) {
    const [isLoading, setIsLoading] = useState(false);
    const [molecules, setMolecules] = useState([
        { name: "Hydrogen Gas", formula: "H2", type: "molecule" },
        { name: "Water", formula: "H2O", type: "molecule" },
        { name: "Hydrochloric Acid", formula: "HCl", type: "molecule" },
    ]);

    useEffect(() => {
      startArrowAnimation();
    }, [])
    
    const netInfo = useNetInfo();

    const ElementButton = (nestedProps) => {
      const fetchElementData = async (item, type) => {
        setIsLoading(true);
        await props.getElementData(item, type);

        // Wait until data is not undefined
        while (props.atoms_x == undefined || props.element == undefined) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
        props.navigation.navigate('Featurer');
        setIsLoading(false);
      };
      
    
      return (
        <TouchableOpacity  
          onPress={() => {
            if (netInfo.isConnected) {
              fetchElementData(nestedProps.formula, nestedProps.type);
            } else {
              alert("Please connect to the internet to use this feature.");
            }
          }}
          style={styles.appButtonContainer}
        >
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

          <Table navigation={props.navigation} />
        </View>
      );
    }

    const arrowAnim = useRef(new Animated.Value(0)).current;

    const startArrowAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(arrowAnim, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(arrowAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          })
        ])
      ).start();
    };

    const circles = Array.from({ length: 40 }).map(() => ({
      x: Math.floor(Math.random() * 300),
      y: Math.floor(Math.random() * 500),
      size: Math.floor(Math.random() * 50) + 25,
    }));

    return (
        <ScrollView style={styles.parentContainer}>
          <View style={styles.container}>
          <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: -10 }}>
              {circles.map((circle, index) => (
                <Circle key={index} {...circle} />
              ))}
          </View>
            <Image source={require('../assets/icon.png')} style={styles.icon} />
            <Text style={[{ fontFamily: 'Outfit_600SemiBold', fontSize: 40 }, styles.appGenericText]}>
              <Text style={{ color: '#fecaca' }}>Electronify</Text>.
            </Text>

            <Text style={[{ fontFamily: 'Outfit_400Regular', fontSize: 20 }, styles.appGenericText]}>
              Visualizing Quantum Mechanics. Reimagined.
            </Text>

            <Animated.View style={[styles.arrowContainer, { transform: [{ translateY: arrowAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 5],
            }) }]}]}>
              <Ionicons name="chevron-down" size={28} color="#fff" />
            </Animated.View>
          </View>

          {!isLoading ? (
            <>
              <AtomSection />

              <TouchableOpacity  
                onPress={() => {
                  if (netInfo.isConnected) {
                    props.navigation.navigate('ExplainAtom');
                    
                  } else {
                    alert("Please connect to the internet to use this feature.");
                  }
                }}
                style={[styles.appButtonContainer, { marginLeft: 20, marginRight: 20 }]}
              >
                <Text style={[{ fontFamily: "Outfit_600SemiBold" }, styles.appButtonTextHeader, { fontSize: 24 }]}>Schrödinger equation?</Text>
                <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.appButtonText]}>Tap to learn more</Text>
              </TouchableOpacity>

              <MoleculeSection />

              <TouchableOpacity  
                onPress={() => {
                  if (netInfo.isConnected) {
                    props.navigation.navigate('ExplainMolecule');

                  } else {
                    alert("Please connect to the internet to use this feature.");
                  }
                }}
                style={[styles.appButtonContainer, { marginLeft: 20, marginRight: 20}]}
              >
                <Text style={[{ fontFamily: "Outfit_600SemiBold" }, styles.appButtonTextHeader, { color: '#fecaca' }]}>What is DFT?</Text>
                <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.appButtonText]}>Tap to learn more</Text>
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.borderlessContainer}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}

          <Text style={[{ fontFamily: 'Outfit_400Regular', fontSize: 32, margin: 10, marginTop: 20 }, styles.appGenericText]}>
            For students,{"\n"}by a student.
          </Text>

          <Text style={[{ fontFamily: 'Outfit_400Regular', fontSize: 14, marginLeft: 10, marginRight: 10 }, styles.appGenericText]}>
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
    backgroundColor: 'rgba(79, 97, 125, 0.4)',
    alignItems: 'center',
    justifyContent: 'center', 
    textAlign: 'center',
    borderRadius: 10,
  },

  icon: {
    width: 100,
    height: 100,
    margin: 5,
  },

  circle: {
    position: 'absolute',
    backgroundColor: 'rgba(28, 46, 74, 0.5)',
    borderRadius: 50,
  },

  borderlessContainer: {
    margin: 20,
    padding: 15,
    backgroundColor: 'rgba(28, 46, 74, 0.4)',
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
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    borderRadius: 10,
    borderWidth: 5,
    borderColor: '#1c2e4a',
    backgroundColor: 'rgba(28, 46, 74, 0.4)'
  },

  arrowContainer: {
    margin: 10,
    bottom: 0,
    alignSelf: 'center',
  },

  scrollTextContainer: {
    bottom: 0,
    alignSelf: 'center',
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