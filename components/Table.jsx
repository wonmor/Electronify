import { useState } from "react";
import { Text, View, FlatList, TouchableOpacity } from 'react-native';

const Table = () => {
    const [elements, setElements] = useState([
      { symbol: 'K', name: 'Potassium' },
      { symbol: 'O', name: 'Oxygen' },
      { symbol: 'Cu', name: 'Copper' },
      // Add more elements here
    ]);
  
    return (
      <View style={styles.list}>
        {elements.map(element => (
          <TouchableOpacity style={styles.elementContainer} key={element.symbol}>
            <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.symbolText]}>{element.symbol}</Text>
            <Text style={[{ fontFamily: "Outfit_400Regular" }, styles.nameText]}>{element.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };
  
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
  
  
  export default Table;