import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Keyboard,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import elements from "../assets/elements.json";

const Autocomplete = () => {
  const [query, setQuery] = useState("");
  const [filteredElements, setFilteredElements] = useState([]);

  const handleInputChange = (text) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = elements.filter((element) =>
        element.symbol.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredElements(filtered);
    } else {
      setFilteredElements([]);
    }
  };

  const handleSelectElement = (element) => {
    setQuery(element.symbol);
    setFilteredElements([]);
  };

  const renderElement = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => handleSelectElement(item)}
    >
      <Text style={styles.itemText}>{item.symbol}</Text>
      <Text style={styles.itemText}>{item.name}</Text>
      <Text style={styles.itemText}>{item.molarMass} g/mol</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search for an element"
        onChangeText={handleInputChange}
        value={query}
      />
      <FlatList
        style={styles.list}
        data={filteredElements}
        renderItem={renderElement}
        keyExtractor={(item) => item.symbol}
      />
    </View>
  );
};

const MolarMass = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.parent}>
        <View style={styles.container}>
          <Text style={styles.text}>Molar Mass</Text>
          <Autocomplete />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MolarMass;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    paddingTop: 50,
    alignItems: "center",
    backgroundColor: "#1c2e4a",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 4,
    padding: 10,
    width: 200,
    marginBottom: 20,
    backgroundColor: "black",
    color: "white",
  },
  list: {
    width: "80%",
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
});
