import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import * as Haptics from 'expo-haptics';

const SegmentedControl = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState([0]);
  const [customStyleIndex, setCustomStyleIndex] = useState(0);

  const handleSingleIndexSelect = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIndex(index);
  };

  const handleMultipleIndexSelect = (index) => {
    if (selectedIndices.includes(index)) {
      setSelectedIndices(selectedIndices.filter((i) => i !== index));
    } else {
      setSelectedIndices([...selectedIndices, index]);
    }
  };

  const handleCustomIndexSelect = (index) => {
    setCustomStyleIndex(index);
  };

  return (
    <View style={styles.container}>
      <SegmentedControlTab
        values={['HOMO', 'LUMO']}
        selectedIndex={selectedIndex}
        tabStyle={styles.tabStyle}
        tabTextStyle={{ fontFamily: "Outfit_600SemiBold", color: "#0073B2" }}
        activeTabStyle={styles.activeTabStyle}
        onTabPress={handleSingleIndexSelect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F0f0f0',
    minHeight: 50,
    padding: 10,
    borderRadius: 10,
    margin: 10,
    maxWidth: 300,
  },
  headerText: {
    padding: 8,
    fontSize: 14,
    color: '#0073B2',
    textAlign: 'center',
  },
  Seperator: {
    marginHorizontal: -10,
    alignSelf: 'stretch',
    borderTopWidth: 1,
    borderTopColor: '#888888',
    marginTop: 24,
  },
  tabStyle: {
    borderColor: '#0073B2',
  },
  activeTabStyle: {
    backgroundColor: '#0073B2',
  },
});

export default SegmentedControl;
