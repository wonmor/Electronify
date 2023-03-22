import React, { useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { useNetInfo } from "@react-native-community/netinfo";
import { getElementData } from "./utils/actions";
import { connect } from "react-redux";

import Hypher from 'hypher';
import english from 'hyphenation.en-us';

const h = new Hypher(english);

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    padding: 10,
    margin: 10,
  },
  cell: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
    padding: 5,
    margin: 1,
    height: 80,
    width: 90,
  },
  alkali: {
    backgroundColor: "#f6d1a2",
  },
  alkaline: {
    backgroundColor: "#f2f2f2",
  },
  transition: {
    backgroundColor: "#c0c0c0",
  },
  postTransition: {
    backgroundColor: "#d9d9d9",
  },
  metalloid: {
    backgroundColor: "#d9e2f3",
  },
  nonmetal: {
    backgroundColor: "#f5c1c1",
  },
  halogen: {
    backgroundColor: "#f5c1c1",
  },
  nobleGas: {
    backgroundColor: "#c3f5c1",
  },
  lanthanoid: {
    backgroundColor: "#f7e1fc",
  },
  actinoid: {
    backgroundColor: "#f7e1fc",
  },
  symbol: {
    fontSize: 18,
  },
  name: {
    fontSize: 12,
    textAlign: "center",
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    margin: 5,
  },
  legendBox: {
    width: 20,
    height: 20,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 3,
    borderColor: "#ccc",
  },
  legendBoxLabel: {
    fontSize: 12,
    textAlign: "center",
  },
  legendLabel: {
    fontSize: 12,
  },
});

const LegendItem = ({ label, style, orbitalShape }) => (
  <View style={styles.legendItem}>
    <View style={[styles.legendBox, style]}>
      <Text style={[styles.legendBoxLabel, { fontFamily: 'Outfit_400Regular', }]}>{orbitalShape}</Text>
    </View>
    <View>
      <Text style={[styles.legendLabel, { fontFamily: 'Outfit_400Regular' }]}>{label}</Text>
    </View>
  </View>
);


const Legend = () => (
  <View style={styles.legend}>
    <LegendItem label="Alkali" style={styles.alkali} orbitalShape="s" />
    <LegendItem label="Alkaline" style={styles.alkaline} orbitalShape="s" />
    <LegendItem label="Transition" style={styles.transition} orbitalShape="d" />
    <LegendItem label="Post-Transition" style={styles.postTransition} orbitalShape="p" />
    <LegendItem label="Metalloid" style={styles.metalloid} orbitalShape="p" />
    <LegendItem label="Nonmetal" style={styles.nonmetal} orbitalShape="p" />
    <LegendItem label="Halogen" style={styles.halogen} orbitalShape="p" />
    <LegendItem label="Noble Gas" style={styles.nobleGas} orbitalShape="p" />
    <LegendItem label="Lanthanoid" style={styles.lanthanoid} orbitalShape="f" />
    <LegendItem label="Actinoid" style={styles.actinoid} orbitalShape="f" />
  </View>
);

const ELEMENTS = [
  { symbol: "H", name: "Hydrogen", group: 1, period: 1, type: "nonmetal" },
  { symbol: "He", name: "Helium", group: 18, period: 1, type: "nobleGas" },
  { symbol: "Li", name: "Lithium", group: 1, period: 2, type: "alkali" },
  { symbol: "Be", name: "Beryllium", group: 2, period: 2, type: "alkaline" },
  { symbol: "B", name: "Boron", group: 13, period: 2, type: "metalloid" },
  { symbol: "C", name: "Carbon", group: 14, period: 2, type: "nonmetal" },
  { symbol: "N", name: "Nitrogen", group: 15, period: 2, type: "nonmetal" },
  { symbol: "O", name: "Oxygen", group: 16, period: 2, type: "nonmetal" },
  { symbol: "F", name: "Fluorine", group: 17, period: 2, type: "halogen" },
  { symbol: "Ne", name: "Neon", group: 18, period: 2, type: "nobleGas" },
  { symbol: "Na", name: "Sodium", group: 1, period: 3, type: "alkali" },
  { symbol: "Mg", name: "Magnesium", group: 2, period: 3, type: "alkaline" },
  {
    symbol: "Al",
    name: "Aluminum",
    group: 13,
    period: 3,
    type: "postTransition",
  },
  { symbol: "Si", name: "Silicon", group: 14, period: 3, type: "metalloid" },
  { symbol: "P", name: "Phosphorus", group: 15, period: 3, type: "nonmetal" },
  { symbol: "S", name: "Sulfur", group: 16, period: 3, type: "nonmetal" },
  { symbol: "Cl", name: "Chlorine", group: 17, period: 3, type: "halogen" },
  { symbol: "Ar", name: "Argon", group: 18, period: 3, type: "nobleGas" },
  { symbol: "K", name: "Potassium", group: 1, period: 4, type: "alkali" },
  { symbol: "Ca", name: "Calcium", group: 2, period: 4, type: "alkaline" },
  { symbol: "Sc", name: "Scandium", group: 3, period: 4, type: "transition" },
  { symbol: "Ti", name: "Titanium", group: 4, period: 4, type: "transition" },
  { symbol: "V", name: "Vanadium", group: 5, period: 4, type: "transition" },
  { symbol: "Cr", name: "Chromium", group: 6, period: 4, type: "transition" },
  { symbol: "Mn", name: "Manganese", group: 7, period: 4, type: "transition" },
  { symbol: "Fe", name: "Iron", group: 8, period: 4, type: "transition" },
  { symbol: "Co", name: "Cobalt", group: 9, period: 4, type: "transition" },
  { symbol: "Ni", name: "Nickel", group: 10, period: 4, type: "transition" },
  { symbol: "Cu", name: "Copper", group: 11, period: 4, type: "transition" },
  { symbol: "Zn", name: "Zinc", group: 12, period: 4, type: "transition" },
  {
    symbol: "Ga",
    name: "Gallium",
    group: 13,
    period: 4,
    type: "postTransition",
  },
  { symbol: "Ge", name: "Germanium", group: 14, period: 4, type: "metalloid" },
  { symbol: "As", name: "Arsenic", group: 15, period: 4, type: "metalloid" },
  { symbol: "Se", name: "Selenium", group: 16, period: 4, type: "nonmetal" },
  { symbol: "Br", name: "Bromine", group: 17, period: 4, type: "halogen" },
  { symbol: "Kr", name: "Krypton", group: 18, period: 4, type: "nobleGas" },
  { symbol: "Rb", name: "Rubidium", group: 1, period: 5, type: "alkali" },
  { symbol: "Sr", name: "Strontium", group: 2, period: 5, type: "alkaline" },
  { symbol: "Y", name: "Yttrium", group: 3, period: 5, type: "transition" },
  { symbol: "Zr", name: "Zirconium", group: 4, period: 5, type: "transition" },
  { symbol: "Nb", name: "Niobium", group: 5, period: 5, type: "transition" },
  { symbol: "Mo", name: "Molybdenum", group: 6, period: 5, type: "transition" },
  { symbol: "Tc", name: "Technetium", group: 7, period: 5, type: "transition" },
  { symbol: "Ru", name: "Ruthenium", group: 8, period: 5, type: "transition" },
  { symbol: "Rh", name: "Rhodium", group: 9, period: 5, type: "transition" },
  { symbol: "Pd", name: "Palladium", group: 10, period: 5, type: "transition" },
  { symbol: "Ag", name: "Silver", group: 11, period: 5, type: "transition" },
  { symbol: "Cd", name: "Cadmium", group: 12, period: 5, type: "transition" },
  {
    symbol: "In",
    name: "Indium",
    group: 13,
    period: 5,
    type: "postTransition",
  },
  { symbol: "Sn", name: "Tin", group: 14, period: 5, type: "postTransition" },
  { symbol: "Sb", name: "Antimony", group: 15, period: 5, type: "metalloid" },
  { symbol: "Te", name: "Tellurium", group: 16, period: 5, type: "metalloid" },
  { symbol: "I", name: "Iodine", group: 17, period: 5, type: "halogen" },
  { symbol: "Xe", name: "Xenon", group: 18, period: 5, type: "nobleGas" },
  { symbol: "Cs", name: "Cesium", group: 1, period: 6, type: "alkali" },
  { symbol: "Ba", name: "Barium", group: 2, period: 6, type: "alkaline" },
  { symbol: "La", name: "Lanthanum", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Ce", name: "Cerium", group: 3, period: 6, type: "lanthanide" },
  {
    symbol: "Pr",
    name: "Praseodymium",
    group: 3,
    period: 6,
    type: "lanthanide",
  },
  { symbol: "Nd", name: "Neodymium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Pm", name: "Promethium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Sm", name: "Samarium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Eu", name: "Europium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Gd", name: "Gadolinium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Tb", name: "Terbium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Dy", name: "Dysprosium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Ho", name: "Holmium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Er", name: "Erbium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Tm", name: "Thulium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Yb", name: "Ytterbium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Lu", name: "Lutetium", group: 3, period: 6, type: "lanthanide" },
  { symbol: "Hf", name: "Hafnium", group: 4, period: 6, type: "transition" },
  { symbol: "Ta", name: "Tantalum", group: 5, period: 6, type: "transition" },
  { symbol: "W", name: "Tungsten", group: 6, period: 6, type: "transition" },
  { symbol: "Re", name: "Rhenium", group: 7, period: 6, type: "transition" },
  { symbol: "Os", name: "Osmium", group: 8, period: 6, type: "transition" },
  { symbol: "Ir", name: "Iridium", group: 9, period: 6, type: "transition" },
  { symbol: "Pt", name: "Platinum", group: 10, period: 6, type: "transition" },
  { symbol: "Au", name: "Gold", group: 11, period: 6, type: "transition" },
  { symbol: "Hg", name: "Mercury", group: 12, period: 6, type: "transition" },
  {
    symbol: "Tl",
    name: "Thallium",
    group: 13,
    period: 6,
    type: "postTransition",
  },
  { symbol: "Pb", name: "Lead", group: 14, period: 6, type: "postTransition" },
  {
    symbol: "Bi",
    name: "Bismuth",
    group: 15,
    period: 6,
    type: "postTransition",
  },
  { symbol: "Po", name: "Polonium", group: 16, period: 6, type: "metalloid" },
  { symbol: "At", name: "Astatine", group: 17, period: 6, type: "halogen" },
  { symbol: "Rn", name: "Radon", group: 18, period: 6, type: "nobleGas" },
  { symbol: "Fr", name: "Francium", group: 1, period: 7, type: "alkali" },
  { symbol: "Ra", name: "Radium", group: 2, period: 7, type: "alkaline" },
  { symbol: "Ac", name: "Actinium", group: 3, period: 7, type: "actinide" },
  { symbol: "Th", name: "Thorium", group: 3, period: 7, type: "actinide" },
  { symbol: "Pa", name: "Protactinium", group: 3, period: 7, type: "actinide" },
  { symbol: "U", name: "Uranium", group: 3, period: 7, type: "actinide" },
  { symbol: "Np", name: "Neptunium", group: 3, period: 7, type: "actinide" },
  { symbol: "Pu", name: "Plutonium", group: 3, period: 7, type: "actinide" },
  { symbol: "Am", name: "Americium", group: 3, period: 7, type: "actinide" },
  { symbol: "Cm", name: "Curium", group: 3, period: 7, type: "actinide" },
  { symbol: "Bk", name: "Berkelium", group: 3, period: 7, type: "actinide" },
  { symbol: "Cf", name: "Californium", group: 3, period: 7, type: "actinide" },
  { symbol: "Es", name: "Einsteinium", group: 3, period: 7, type: "actinide" },
  { symbol: "Fm", name: "Fermium", group: 3, period: 7, type: "actinide" },
  { symbol: "Md", name: "Mendelevium", group: 3, period: 7, type: "actinide" },
  { symbol: "No", name: "Nobelium", group: 3, period: 7, type: "actinide" },
  { symbol: "Lr", name: "Lawrencium", group: 3, period: 7, type: "actinide" },
  {
    symbol: "Rf",
    name: "Rutherfordium",
    group: 4,
    period: 7,
    type: "transition",
  },
  { symbol: "Db", name: "Dubnium", group: 5, period: 7, type: "transition" },
  { symbol: "Sg", name: "Seaborgium", group: 6, period: 7, type: "transition" },
  { symbol: "Bh", name: "Bohrium", group: 7, period: 7, type: "transition" },
  { symbol: "Hs", name: "Hassium", group: 8, period: 7, type: "transition" },
  { symbol: "Mt", name: "Meitnerium", group: 9, period: 7, type: "transition" },
  {
    symbol: "Ds",
    name: "Darmstadtium",
    group: 10,
    period: 7,
    type: "transition",
  },
  {
    symbol: "Rg",
    name: "Roentgenium",
    group: 11,
    period: 7,
    type: "transition",
  },
  {
    symbol: "Cn",
    name: "Copernicium",
    group: 12,
    period: 7,
    type: "transition",
  },
  {
    symbol: "Nh",
    name: "Nihonium",
    group: 13,
    period: 7,
    type: "postTransition",
  },
  {
    symbol: "Fl",
    name: "Flerovium",
    group: 14,
    period: 7,
    type: "postTransition",
  },
  {
    symbol: "Mc",
    name: "Moscovium",
    group: 15,
    period: 7,
    type: "postTransition",
  },
  {
    symbol: "Lv",
    name: "Livermorium",
    group: 16,
    period: 7,
    type: "postTransition",
  },
  { symbol: "Ts", name: "Tennessine", group: 17, period: 7, type: "halogen" },
  { symbol: "Og", name: "Oganesson", group: 18, period: 7, type: "nobleGas" },
];

const allowedSymbols = ['H', 'Be', 'B', 'Li', 'Na', 'K', 'O', 'F', 'Ne', 'Fe', 'Co', 'Ni', 'Cu', 'Zn', 'Pd', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu', 'Gd'];

function PeriodicTable(props) {
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
    
    const renderCell = (element) => {
      const { symbol, name, type } = element;
      return (
        <TouchableOpacity
            key={element.symbol}
            style={[styles.cell, styles[element.type]]}
            onPress={() => {
                if (netInfo.isConnected) {
                  fetchElementData(element.symbol, 'atom');
                } else {
                  alert("Please connect to the internet to use this feature.");
                }
              }}
        >
            <Text style={[styles.symbol, { fontFamily: 'Outfit_600SemiBold' }]}>{element.symbol}</Text>
            <Text style={[styles.name, { fontFamily: 'Outfit_400Regular' }]}>{h.hyphenateText(element.name)}</Text>
        </TouchableOpacity>
      );
    };
  
    const renderRow = (start, end) => {
        const row = [];
        for (let i = start; i <= end; i++) {
          const element = ELEMENTS[i];
          if (allowedSymbols.includes(element.symbol)) {
            row.push(renderCell(element));
          }
        }
        return row;
      };
    
      return (
        <>
        {!isLoading ? (
        <>
          <View style={styles.container}>
            <View>{renderRow(0, 1)}</View>
            <View>{renderRow(2, 9)}</View>
            <View>{renderRow(10, 17)}</View>
            <View>{renderRow(18, 35)}</View>
            <View>{renderRow(36, 53)}</View>
            <View>{renderRow(54, 71)}</View>
            <View>{renderRow(72, 89)}</View>
            <View>{renderRow(90, 103)}</View>
            <View>{renderRow(104, 117)}</View>
          </View>
    
          <Legend />
        </>
        ) : (
            <ActivityIndicator style={{ margin: 10 }} size="large" color="#fff" />
          )}
          </>
    );
  }

  const mapStateToProps = (state) => {
    return state;
  };
  
  const mapDispatchToProps = (dispatch) => ({
    getElementData: (item, type) => dispatch(getElementData(item, type)),
  });

  export default connect(mapStateToProps, mapDispatchToProps)(PeriodicTable);