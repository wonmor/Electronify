import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';

const ExplainMolecule = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadEnd = () => {
    setIsLoading(false);
  };

  return (
    <View style={styles.container}>
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.sourceText, { fontSize: 32 }]}>Loading...</Text>
        </View>
      ) : null}
      <WebView
        source={{ uri: 'https://www.sciencedirect.com/topics/physics-and-astronomy/density-functional-theory' }}
        onLoadEnd={handleLoadEnd}
      />
      <View style={styles.bottomBar}>
        <Text style={styles.sourceText}>Source: ScienceDirect</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#dcdcdc',
    paddingBottom: 30
  },
  sourceText: {
    color: '#808080',
    fontFamily: "Outfit_400Regular",
    fontSize: 18,
    textAlign: 'center',
  },
});

export default ExplainMolecule;