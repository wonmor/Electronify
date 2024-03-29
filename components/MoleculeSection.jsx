import { useState } from "react";
import { connect } from "react-redux";
import { useNetInfo } from "@react-native-community/netinfo";
import { getElementData } from "./utils/actions";
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from "react-native";

import AnimatedLoader from "react-native-animated-loader";
import * as Haptics from "expo-haptics";

import { moleculeDict } from "./Globals";

function MoleculeSection(props) {
  const [isLoading, setIsLoading] = useState(false);

  const molecules = [
    {
      name: "Methanol",
      formula: "CH3OH",
      type: "molecule",
      structure: "AX3E",
      color: "#00ffff",
    },
    {
      name: "Benzene",
      formula: "C6H6",
      type: "molecule",
      structure: "AX3",
      color: "#ff7f50",
    },
    {
      name: "Ethene",
      formula: "C2H4",
      type: "molecule",
      structure: "AX2E",
      color: "#ffd6e5",
    },
    {
      name: "Hydrogen Gas",
      formula: "H2",
      type: "molecule",
      structure: "AX2",
      color: "#b0e0e6",
    },
    {
      name: "Water",
      formula: "H2O",
      type: "molecule",
      structure: "AX2E2",
      color: "#ffe4c4",
    },
    {
      name: "Hydrochloric Acid",
      formula: "HCl",
      type: "molecule",
      structure: "AX",
      color: "#f0f8ff",
    },
    {
      name: "Chlorine Gas",
      formula: "Cl2",
      type: "molecule",
      structure: "AX2",
      color: "#7fffd4",
    },
  ];


  const ElementButton = (nestedProps) => {
    const netInfo = useNetInfo();

    const fetchElementData = async (item, type) => {
      setIsLoading(true);
      await props.getElementData(item, type);

      props.navigation.navigate("Featurer");
      setIsLoading(false);
    };

    const stickStyle = {
      backgroundColor: nestedProps.color,
      width: 10,
      height: 60,
      borderRadius: 5,
      marginLeft: 5,
      position: "absolute",
      top: 0,
      left: 20,
      transform: [{ rotateZ: "45deg" }],
    };

    const ballStyle = {
      backgroundColor: nestedProps.color,
      width: 50,
      height: 50,
      borderRadius: 25,
      position: "absolute",
      marginLeft: 10,
      top: 10,
      left: 0,
      justifyContent: "center",
      alignItems: "center",
    };

    return (
      <TouchableOpacity
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          
          if (netInfo.isConnected) {
            fetchElementData(nestedProps.formula, nestedProps.type);
          } else {
            alert("Please connect to the internet to use this feature.");
          }
        }}
        style={styles.appButtonContainer}
      >
        <View style={stickStyle} />
        <View style={ballStyle}>
          <Text style={{ fontSize: 25, fontFamily: "Outfit_400Regular" }}>
            {nestedProps.formula.charAt(0)}
          </Text>
        </View>
        <Text
          style={[
            { fontFamily: "Outfit_400Regular" },
            styles.appButtonTextHeader,
          ]}
        >
          {nestedProps.formula}
        </Text>
        <Text
          style={[{ fontFamily: "Outfit_400Regular" }, styles.appButtonText]}
        >
          {nestedProps.elementName}
        </Text>
        <Text
          style={[styles.structureText, { fontFamily: "Outfit_400Regular" }]}
        >
          {nestedProps.structure}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <ScrollView>
      <View style={styles.borderlessContainer}>
        {molecules.map((molecule) => (
          <ElementButton
            elementName={molecule.name}
            formula={molecule.formula}
            type={molecule.type}
            key={molecule.name}
            color={molecule.color}
            structure={molecule.structure + " | " + moleculeDict[molecule.formula][2]}
          />
        ))}

        <AnimatedLoader
          style={{ margin: 10 }}
          visible={isLoading}
          source={require("../assets/animations/loader.json")}
          overlayColor="rgba(0,0,0,1)"
          animationStyle={styles.lottie}
          speed={1}
        >
          <Text
            style={{
              fontFamily: "Outfit_600SemiBold",
              color: "white",
              margin: 5,
              fontSize: 20,
            }}
          >
            Processing the data...
          </Text>
        </AnimatedLoader>
      </View>
    </ScrollView>
  );
}

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
  },

  circle: {
    position: "absolute",
    backgroundColor: "rgba(28, 46, 74, 0.5)",
    borderRadius: 50,
  },

  borderlessContainer: {
    margin: 20,
    padding: 15,
    paddingTop: 5,
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
    position: "relative",
  },

  appButtonText: {
    fontSize: 18,
    color: "#fff",
    alignSelf: "center",
    marginTop: 10,
  },

  appButtonTextHeader: {
    fontSize: 30,
    color: "#bae6fd",
    alignSelf: "center",
  },

  structureText: {
    color: "#fff",
    alignSelf: "center",
    marginTop: 10,
  },
  lottie: {
    width: 100,
    height: 100,
  },
});

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => ({
  getElementData: (item, type) => dispatch(getElementData(item, type)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MoleculeSection);
