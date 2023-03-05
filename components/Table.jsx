import { useState } from "react";
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNetInfo } from "@react-native-community/netinfo";
import { getElementData } from "./utils/actions";
import { connect } from "react-redux";

const Table = (props) => {
    const [elements, setElements] = useState([
      { symbol: 'K', name: 'Potassium' },
      { symbol: 'O', name: 'Oxygen' },
      { symbol: 'Cu', name: 'Copper' },
      // Add more elements here
    ]);

    const [isLoading, setIsLoading] = useState(false);

    const netInfo = useNetInfo();

    const fetchElementData = async (item, type) => {
        await props.getElementData(item, type);
        // Async function will ensure that it returns a promise...
        setTimeout(() => {
          props.navigation.navigate('Featurer');
          setIsLoading(false);
        }, 500);
    };

    return (
      <View style={styles.list}>
        {!isLoading ? elements.map(element => (
          <TouchableOpacity onPress={() => {
            if (netInfo.isConnected) {
              setIsLoading(true);
              fetchElementData(props.formula, props.type)
           
            } else {
              alert("Please connect to the internet to use this feature.");
            }
          }} style={styles.elementContainer} key={element.symbol}>
            <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.symbolText]}>{element.symbol}</Text>
            <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.nameText]}>{element.name}</Text>
          </TouchableOpacity>
        )) : (
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
  
  const styles = {
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
  };
  
  
  export default connect(mapStateToProps, mapDispatchToProps)(Table);