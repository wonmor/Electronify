import { useState } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity, StyleSheet } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import { getElementData } from "./utils/actions";
import { connect } from "react-redux";

const Table = (props) => {
  const [elements, setElements] = useState([
    { symbol: 'H', name: 'Hydrogen' },
    { symbol: 'O', name: 'Oxygen' },
    { symbol: 'Cu', name: 'Copper' },
    // Add more elements here
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const netInfo = useNetInfo();

  const fetchElementData = async (item, type) => {
    setIsLoading(true);
    await props.getElementData(item, type);

    // Wait until data is not undefined
    while (props.x_coords == undefined || props.element == undefined) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    props.navigation.navigate('Featurer2');
    setIsLoading(false);
  };

  return (
    <View style={styles.list}>
      {!isLoading ? (
        elements.map(element => (
          <TouchableOpacity
            onPress={() => {
              if (netInfo.isConnected) {
                fetchElementData(element.symbol, 'atom');
              } else {
                alert("Please connect to the internet to use this feature.");
              }
            }}
            style={styles.elementContainer}
            key={element.symbol}
          >
            <Text style={[styles.symbolText, { fontFamily: "Outfit_400Regular" }]}>
              {element.symbol}
            </Text>
            <Text style={[styles.nameText, { fontFamily: "Outfit_400Regular" }]}>
              {element.name}
            </Text>
          </TouchableOpacity>
        ))
      ) : (
        <ActivityIndicator size="large" color="#fff" />
      )}
    </View>
  );
};

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => ({
  getElementData: (item, type) => dispatch(getElementData(item, type)),
});

const styles = StyleSheet.create({
  list: {
    padding: 20,
  },
  elementContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: '#394d6d',
    padding: 15,
    borderRadius: 10,
    borderColor: '#fff',
    borderWidth: 1,
    elevation: 1,
  },
  symbolText: {
    fontSize: 48,
    color: "#bae6fd",
    marginRight: 10,
  },
  nameText: {
    fontSize: 16,
    color: 'white',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Table);
