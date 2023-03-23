import React, { useState } from "react";
import { View, TextInput, Text, Button } from "react-native";
import { LineChart, Grid } from "react-native-svg-charts";
import * as shape from "d3-shape";

const HydrogenWaveFunction = (props) => {
  const [n, setN] = useState("1");
  const [l, setL] = useState("0");
  const [m, setM] = useState("0");
  const [numPoints, setNumPoints] = useState("200");
  const [result, setResult] = useState(null);

  const solveHydrogenWaveFunction = () => {
    // Parse input
    const nValue = parseInt(n);
    const lValue = parseInt(l);
    const mValue = parseInt(m);
    const numPointsValue = parseInt(numPoints);

    // Calculate step size
    const rMax = 10 * nValue * nValue;
    const dr = rMax / numPointsValue;

    // Define constants and initial values
    const alpha = 1 / (nValue * 2);
    const beta = (lValue * (lValue + 1)) / (nValue * nValue * 4);
    const V = (r) => -1 / r;
    const psi = new Array(numPointsValue);
    const F = new Array(numPointsValue);

    // Set initial values at r=0 and r=dr
    psi[0] = 0;
    F[0] = alpha * (alpha - V(dr) + beta * dr * dr);
    psi[1] = dr;
    F[1] = alpha * (alpha - V(2 * dr) + beta * 2 * dr * dr);

    // Solve for psi using the Numerov method
    for (let i = 2; i < numPointsValue; i++) {
      const r = i * dr;
      const VValue = V(r);
      const k = 2 * (alpha - VValue);
      const q = beta * r * r;
      const a = 1 - (dr * dr * q) / 12;
      const b = (dr * dr * k) / 2 - 10 * a;
      const c = 1 + (dr * dr * q) / 12;
      F[i] = a * F[i - 2] + b * F[i - 1] + c * alpha * psi[i - 1];
      psi[i] = F[i] / (c * alpha);
    }

    // Normalize the wave function
    const norm = Math.sqrt(trapezoidalIntegral(psi, dr));
    psi.forEach((value, i) => {
      psi[i] = value / norm;
    });

    // Set result
    setResult(psi);
  };

  const trapezoidalIntegral = (array, dx) => {
    let integral = 0;
    for (let i = 0; i < array.length; i++) {
      if (i === 0 || i === array.length - 1) {
        integral += array[i];
      } else {
        integral += 2 * array[i];
      }
    }
    return (integral * dx) / 2;
  };

  const chartData = {
    labels: Array.from({ length: result !== null && result.length }, (_, i) =>
      i.toString()
    ), // x-axis labels
    datasets: [
      {
        data: result,
        color: (opacity = 1) => `rgba(0, 0, 255, ${opacity})`,
        strokeWidth: 2,
        curve: shape.curveNatural,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    ],
  };

  return (
    <View
      style={{ flex: 1, backgroundColor: "#f2f2f2", paddingHorizontal: 20 }}
    >
      <Text
        style={{
          fontWeight: "bold",
          fontSize: 24,
          marginTop: 20,
          marginBottom: 10,
        }}
      >
        Hydrogen Wave Function
      </Text>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{ fontSize: 18 }}>Principal Quantum Number (n): </Text>
        <TextInput
          value={n}
          onChangeText={setN}
          keyboardType="numeric"
          style={{
            flex: 1,
            backgroundColor: "white",
            marginLeft: 10,
            paddingHorizontal: 10,
          }}
        />
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{ fontSize: 18 }}>Orbital Quantum Number (l): </Text>
        <TextInput
          value={l}
          onChangeText={setL}
          keyboardType="numeric"
          style={{
            flex: 1,
            backgroundColor: "white",
            marginLeft: 10,
            paddingHorizontal: 10,
          }}
        />
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{ fontSize: 18 }}>Magnetic Quantum Number (m): </Text>
        <TextInput
          value={m}
          onChangeText={setM}
          keyboardType="numeric"
          style={{
            flex: 1,
            backgroundColor: "white",
            marginLeft: 10,
            paddingHorizontal: 10,
          }}
        />
      </View>
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}
      >
        <Text style={{ fontSize: 18 }}>Number of Points: </Text>
        <TextInput
          value={numPoints}
          onChangeText={setNumPoints}
          keyboardType="numeric"
          style={{
            flex: 1,
            backgroundColor: "white",
            marginLeft: 10,
            paddingHorizontal: 10,
          }}
        />
      </View>
      <Button title="Solve" onPress={solveHydrogenWaveFunction} />
      {/* Display line chart of wave function */}
      {result && (
        <View style={{ flex: 1, marginTop: 20 }}>
          <LineChart
            style={{ flex: 1 }}
            data={chartData.datasets[0].data}
            svg={{
              stroke: chartData.datasets[0].color,
              strokeWidth: chartData.datasets[0].strokeWidth,
            }}
            contentInset={{ top: 20, bottom: 20 }}
            curve={chartData.datasets[0].curve}
          >
            <Grid />
          </LineChart>
          <View style={{ marginTop: 10 }}>
            <Text style={{ fontWeight: "bold", fontSize: 18 }}>
              Wave Function
            </Text>
            <Text
              style={{ fontSize: 16 }}
            >{`n = ${n}, l = ${l}, m = ${m}`}</Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default HydrogenWaveFunction;
