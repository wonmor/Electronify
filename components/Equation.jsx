import React, { useState } from "react";
import { View, TextInput, Text, Button } from "react-native";
import { LineChart } from "react-native-chart-kit";

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

    // Create arrays for wave function and potential energy
    const waveFunction = new Array(numPointsValue).fill(0);

    // Calculate the hydrogen wave function using the approximation method
    for (let i = 0; i < numPointsValue; i++) {
      const r = (i + 1) * dr;
      const u = 2 * r / nValue;
      const rho = 2 * r / nValue;
      const e = -1 / (2 * rho * rho) - 1 / rho;
      const h = e - lValue * (lValue + 1) / (2 * rho * rho);
      const f = 1 / (2 * nValue * rho);
      if (i === 0) {
        waveFunction[i] = 0;
      } else if (i === 1) {
        waveFunction[i] = dr;
      } else {
        waveFunction[i] = (1 - f * dr) * waveFunction[i - 2] - 2 * f * dr * waveFunction[i - 1] + 2 * dr * dr * h * waveFunction[i - 1];
      }
    }

    // Normalize the wave function
    const norm = Math.sqrt(trapezoidalIntegral(waveFunction, dr));
    waveFunction.forEach((value, i) => {
      waveFunction[i] = value / norm;
    });

    // Set result
    setResult(waveFunction);
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
    return integral * dx / 2;
  };

  const chartData = {
    labels: Array.from({ length: result !== null && result.length }, (_, i) => i.toString()), // x-axis labels
    datasets: [{ data: result }] // wave function data
  };

  return (
    <View>
        <Text>Hydrogen Wave Function</Text>
      <Text>Principal Quantum Number (n):</Text>
      <TextInput value={n} onChangeText={setN} keyboardType="numeric" />

      <Text>Orbital Quantum Number (l):</Text>
      <TextInput value={l} onChangeText={setL} keyboardType="numeric" />

      <Text>Magnetic Quantum Number (m):</Text>
      <TextInput value={m} onChangeText={setM} keyboardType="numeric" />

      <Text>Number of Points:</Text>
  <TextInput value={numPoints} onChangeText={setNumPoints} keyboardType="numeric" />

  <Button title="Solve" onPress={solveHydrogenWaveFunction} />

  {/* Display line chart of wave function */}
  {result && (
    <LineChart
      data={chartData}
      width={400}
      height={400}
      yAxisLabel=""
      yAxisSuffix=""
      chartConfig={{
        backgroundColor: "#e26a00",
        backgroundGradientFrom: "#fb8c00",
        backgroundGradientTo: "#ffa726",
        decimalPlaces: 2,
        color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
        style: {
          borderRadius: 16
        },
        propsForDots: {
          r: "6",
          strokeWidth: "2",
          stroke: "#ffa726"
        }
      }}
      bezier
    />
  )}
</View>
);
};

export default HydrogenWaveFunction;
