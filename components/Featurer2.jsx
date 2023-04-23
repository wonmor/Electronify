import { GLView } from "expo-gl";
import { Renderer } from "expo-three";

import React, { useState, useMemo, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { View, Text, StyleSheet } from "react-native";

import OrbitControlsView from "./controls/OrbitControlsView";

import {
  AmbientLight,
  Fog,
  GridHelper,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three";

import { addAtomParticles } from "./Instances";
import { atomDict, getAtomColour } from "./Globals";
import { resetState } from "./utils/actions";

import quantumNums from "../assets/quantum_num.json";

/*
ELECTRONIFY: A React Native App for Visualizing Quantum Mechanics
Developed and Designed by John Seong
--------------------------------------------------------------------
BELOW IS THE MAIN RENDERER FOR THE THREE.JS SCENE
*/

const setUpScene = (sceneColor) => {
  const scene = new Scene();

  scene.fog = new Fog(sceneColor, 1, 10000);
  scene.add(new GridHelper(10, 9, "#fff", "#fff"));

  const ambientLight = new AmbientLight(0x101010);
  scene.add(ambientLight);

  const pointLight = new PointLight(0xffffff, 2, 1000, 1);
  pointLight.position.set(0, 200, 200);
  scene.add(pointLight);

  const spotLight = new SpotLight(0xffffff, 0.5);
  spotLight.position.set(0, 500, 100);
  spotLight.lookAt(scene.position);
  scene.add(spotLight);

  return scene;
};

function Featurer2(props) {
  const [camera, setCamera] = useState(null);
  const [electronConfig, setElectronConfig] = useState([]);
  const [shortenedElementName, setShortenedElementName] = useState("");

  const dispatch = useDispatch();

  let timeout;

  // For the electron configuration
  useEffect(() => {
    if (props.element !== undefined) {
      const electronConfig = atomDict[props.element][4];
      const electronConfigArray = electronConfig.split(" ");

      if (electronConfigArray[0].split("")[0] === "[") {
        setShortenedElementName(electronConfigArray[0]);
        electronConfigArray.shift();
      }

      setElectronConfig(electronConfigArray);
    }
  }, [props.element]);

  // Memoize the scene setup
  const scene = useMemo(() => setUpScene("#394d6d"), []);
  const particles = useMemo(
    () =>
      addAtomParticles(
        scene,
        props.element,
        props.x_coords,
        props.y_coords,
        props.z_coords
      ),
    [props.element, props.x_coords, props.y_coords, props.z_coords, scene]
  );

  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => {
      dispatch(resetState());
      clearTimeout(timeout);
    };
  }, []);

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = "#1c2e4a";
    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    setCamera(camera);

    function update() {}

    // Setup an animation loop
    const render = () => {
      timeout = requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    };

    render();
  };

  return useMemo(
    () => (
      <>
        {props.element !== undefined && (
          <>
            <View style={styles.container}>
              <Text style={styles.title}>
                {atomDict[props.element][1] + "."}
              </Text>
              <Text style={styles.description}>
                {atomDict[props.element][3]}
              </Text>
              <View
                style={{
                  borderRadius: 5,
                  backgroundColor: "white",
                  marginTop: 20,
                  borderColor: "white",
                  borderWidth: 4,
                  overflow: "hidden",
                }}
              >
                <Text
                  style={[
                    styles.electronConfigText,
                    { fontSize: 24, color: "black", padding: 5 },
                  ]}
                >
                  N = {quantumNums[props.element]["n"]}
                  {"   "}L = {quantumNums[props.element]["l"]}
                  {"   "}M<Text style={{ fontSize: 18 }}>L</Text> ={" "}
                  {quantumNums[props.element]["m"]}
                </Text>
              </View>
            </View>
            
            <OrbitControlsView style={{ flex: 1 }} camera={camera}>
              <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
            </OrbitControlsView>

            <View style={styles.secondaryContainerAlternative}>
              <Text
                style={[styles.description, { color: "white", fontSize: 32 }]}
              >
                {shortenedElementName + " "}
                {electronConfig.map((word, index) =>
                  index !== electronConfig.length - 1 ? (
                    <Text key={index}>{word} </Text>
                  ) : (
                    <View
                      key={index}
                      style={[styles.electronConfigItem, { fontSize: 32 }]}
                    >
                      <Text
                        style={[styles.electronConfigText, { fontSize: 32, color: getAtomColour(props.element) }]}
                      >
                        {word}
                      </Text>
                    </View>
                  )
                )}
              </Text>
            </View>
          </>
        )}
      </>
    ),
    [props.element, camera, electronConfig, shortenedElementName]
  );
}

const mapStateToProps = (state) => {
  return state;
};

const mapDispatchToProps = (dispatch) => ({
  getElementData: (item, type) => dispatch(getElementData(item, type)),
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#394d6d",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  secondaryContainer: {
    backgroundColor: "black",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  secondaryContainerAlternative: {
    backgroundColor: "black",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
  },

  title: {
    fontSize: 30,
    fontFamily: "Outfit_600SemiBold",
    color: "#fecaca",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 20,
    fontFamily: "Outfit_400Regular",
    color: "#fff",
    textAlign: "center",
  },

  bottomText: {
    fontSize: 20,
    fontFamily: "Outfit_400Regular",
    color: "#fff",
    textAlign: "center",
    padding: 10
  },

  electronConfigItem: {
    backgroundColor: "#1e293b",
    fontFamily: "Outfit_400Regular",
    borderRadius: 4,
    padding: 4,
  },

  electronConfigText: {
    fontFamily: "Outfit_400Regular",
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(React.memo(Featurer2));
