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
import Icon from "react-native-vector-icons/FontAwesome5";
import Icon2 from "react-native-vector-icons/Feather";

const Autocomplete = () => {
  const Calculator = ({ selectedElements }) => {
    const [result, setResult] = useState(null);

    const handleAdd = () => {
      if (selectedElements.length >= 2) {
        const totalMolarMass = selectedElements.reduce(
          (accumulator, element) => accumulator + element.molarMass,
          0
        );
        setResult(totalMolarMass);
      }
    };

    const handleClear = () => {
      setResult(null);
      setSelectedElements([]);
    };

    return (
      <>
        <View style={styles.calculator}>
          <TouchableOpacity style={styles.button} onPress={handleAdd}>
            <Icon name="plus" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.equalsButton]}
            onPress={handleClear}
          >
            <Icon2 name="delete" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {result && (
          <View style={styles.resultContainer}>
            <Text
              style={[styles.resultText, { fontFamily: "Outfit_400Regular" }]}
            >
              Result: {result.toFixed(3)} g/mol
            </Text>
          </View>
        )}
      </>
    );
  };
  const [query, setQuery] = useState("");
  const [filteredElements, setFilteredElements] = useState([]);
  const [selectedElements, setSelectedElements] = useState([]);
  const [calculatorVisible, setCalculatorVisible] = useState(false);

  const handleInputChange = (text) => {
    setQuery(text);
    if (text.length > 0) {
      const filtered = elements.filter(
        (element) =>
          element.symbol.toLowerCase().startsWith(text.toLowerCase()) ||
          element.name.toLowerCase().startsWith(text.toLowerCase())
      );
      setFilteredElements(filtered);
    } else {
      setFilteredElements([]);
    }
  };

  const handleSelectElement = (element) => {
    setQuery(element.symbol);
    setSelectedElements([...selectedElements, element]);
    setFilteredElements([]);
  };

  const renderElement = ({ item }) => (
    <TouchableWithoutFeedback accessible={false}>
      <TouchableOpacity
        style={styles.item}
        onPress={() => handleSelectElement(item)}
      >
        <Text style={[styles.itemText, { fontFamily: "Outfit_400Regular" }]}>
          {item.symbol}
        </Text>
        <Text style={[styles.itemText, { fontFamily: "Outfit_400Regular" }]}>
          {item.name}
        </Text>
        <Text style={[styles.itemText, { fontFamily: "Outfit_400Regular" }]}>
          {item.molarMass} g/mol
        </Text>
      </TouchableOpacity>
    </TouchableWithoutFeedback>
  );

  return (
    <View style={styles.container}>
      <Text style={[styles.titleText, { fontFamily: "Outfit_600SemiBold" }]}>
        Calculate.
      </Text>
      <TextInput
        style={[styles.input, { fontFamily: "Outfit_400Regular" }]}
        placeholderTextColor="white"
        placeholder="Search for an element..."
        onChangeText={handleInputChange}
        value={query}
      />
      <FlatList
        style={styles.list}
        data={filteredElements}
        renderItem={renderElement}
        keyExtractor={(item) => item.symbol}
      />
      <TouchableOpacity
        style={[styles.button, styles.calculatorButton]}
        onPress={() => setCalculatorVisible(!calculatorVisible)}
      >
        <Icon name="calculator" size={20} color="#fff" />
        <Text style={[styles.buttonText, { fontFamily: "Outfit_600SemiBold" }]}>
          {calculatorVisible ? "Hide Calculator." : "Show Calculator."}
        </Text>
      </TouchableOpacity>
      {calculatorVisible && <Calculator selectedElements={selectedElements} />}
      {selectedElements.length > 0 && (
        <View style={styles.selectedElementsContainer}>
          <Text
            style={[
              styles.titleText,
              { marginBottom: 5, fontFamily: "Outfit_600SemiBold", color: "#fecaca"  },
            ]}
          >
            Selected Elements.
          </Text>
          {selectedElements.map((element) => (
            <View key={element.symbol} style={styles.selectedElement}>
              <Text
                style={[
                  styles.selectedElementSymbol,
                  { fontFamily: "Outfit_600SemiBold" },
                ]}
              >
                {element.symbol}
              </Text>
              <Text
                style={[
                  styles.selectedElementName,
                  { fontFamily: "Outfit_400Regular" },
                ]}
              >
                {element.name}
              </Text>
              <Text
                style={[
                  styles.selectedElementMolarMass,
                  { fontFamily: "Outfit_400Regular" },
                ]}
              >
                {element.molarMass} g/mol
              </Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const MolarMass = () => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.parent}>
        <View style={styles.container}>
          <Autocomplete />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
padding: 10,
    alignItems: "center",
    backgroundColor: "#394d6d",
  },
  titleText: {
    fontSize: 32,
    color: "#bae6fd",
    marginBottom: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 4,
    padding: 10,
    width: 200,
    marginBottom: 20,
    backgroundColor: "#1c2e4a",
    color: "white",
  },
  list: {
    width: 200,
    borderRadius: 4,
    backgroundColor: "#1c2e4a",
    padding: 10,
    marginBottom: 20,
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
  calculatorButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2e7d32",
    padding: 10,
    borderRadius: 4,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 10,
  },
  calculator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  equalsButton: {
    backgroundColor: "#2196f3",
  },
  resultContainer: {
    backgroundColor: "#1c2e4a",
    padding: 10,
    borderRadius: 4,
    margin: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  selectedElementsContainer: {
    width: "100%",
    backgroundColor: "#1c2e4a",
    padding: 10,
    borderRadius: 4,
  },
  selectedElement: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  selectedElementSymbol: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedElementName: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  selectedElementMolarMass: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },
});

export default MolarMass;
