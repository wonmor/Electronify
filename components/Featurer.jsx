import { GLView } from "expo-gl";
import { Renderer } from "expo-three";

import { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { resetState } from "./utils/actions";
import { GLTFLoader } from "three-stdlib";
import { decode } from "base64-arraybuffer";

import * as FileSystem from 'expo-file-system';
import * as THREE from "three";

import SegmentedControl from "./SegmentedControl";
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

import { addParticles } from "./Instances";
import { moleculeDict, getCameraPosition } from "./Globals";

/*
ELECTRONIFY: A React Native App for Visualizing Quantum Mechanics
Developed and Designed by John Seong
--------------------------------------------------------------------
BELOW IS THE MAIN RENDERER FOR THE THREE.JS SCENE
*/

const HSLColorBarLegend = () => {
  return (
    <View style={[styles.barContainer, { fontFamily: "Outfit_600SemiBold", backgroundColor: 'white' }]}>
      <View
        style={[
          styles.colorBar,
          {
            backgroundColor: "#7fffd4", // Dark Green
          },
        ]}
      >
        <Text style={[styles.label, { fontFamily: "Outfit_600SemiBold"}]}>0</Text>
      </View>
      <View
        style={[
          styles.colorBar,
          {
            backgroundColor: "#87CEEB", // Green-Yellow
          },
        ]}
      >
        <Text style={[styles.label, { fontFamily: "Outfit_600SemiBold"}]}>0.2</Text>
      </View>
      <View
        style={[
          styles.colorBar,
          {
            backgroundColor: "#3895D3", // Yellow-Green
          },
        ]}
      >
        <Text style={[styles.label, { fontFamily: "Outfit_600SemiBold"}]}>0.4</Text>
      </View>
      <View
        style={[
          styles.colorBar,
          {
            backgroundColor: "#C3B1E1", // Yellow
          },
        ]}
      >
        <Text style={[styles.label, { fontFamily: "Outfit_600SemiBold"}]}>0.6</Text>
      </View>
      <View
        style={[
          styles.colorBar,
          {
            backgroundColor: "hsl(0, 50%, 75%)", // Red
          },
        ]}
      >
        <Text style={[styles.label, { fontFamily: "Outfit_600SemiBold"}]}>0.8</Text>
      </View>
      <View
        style={[
          styles.colorBar,
          {
            backgroundColor: "hsl(60, 50%, 75%)", // Yellow-Orange
          },
        ]}
      >
        <Text style={[styles.label, { fontFamily: "Outfit_600SemiBold"}]}>1</Text>
      </View>
      <Text style={[styles.label, { color: "black", fontFamily: "Outfit_600SemiBold", margin: 5 }]}>ELECTRON DENSITY</Text>
    </View>
  );
};

const setUpScene = (sceneColor) => {
  const scene = new Scene();

  scene.fog = new Fog(sceneColor, 1, 10000);
  scene.add(new GridHelper(10, 10, "#fff", "#fff"));

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

function Featurer(props) {
  const [camera, setCamera] = useState(null);

  const dispatch = useDispatch();

  let timeout, scene;

  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => {
      dispatch(resetState());
      clearTimeout(timeout);
    };
  }, []);

  const url = 'https://electronvisual.org' + `/api/downloadGLB/C2H4_HOMO_GLTF`;

  const [gltf, setGltf] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isHomo, setIsHomo] = useState(true);
  const [rotation, setRotation] = useState({ x: 0, y: 1.25, z: 0.15 });
  const [scale, setScale] = useState(6);
  const [offset, setOffset] = useState([0, 0, 0]);

  useEffect(() => {
    if (scene !== null && fileName !== "") {
      (async () => {
        const loader = new GLTFLoader();
  
        try {
          const { uri } = await FileSystem.downloadAsync(url, FileSystem.cacheDirectory + fileName);
          const fileText = await FileSystem.readAsStringAsync(uri);
          const data = JSON.parse(fileText);
          const object = loader.parse(fileText);
          setGltf(object);
        } catch (error) {
          console.error(error);
        }
      })();
    }
  }, [url, scene, fileName]);

  useEffect(() => {
    if (fileName.includes("C2H4")) {
      setRotation({x: 0, y: 1.25, z: 0.15});
      setScale(6);
      
    } else if (fileName.includes("H2O")) {
      setRotation({x: 0, y: Math.PI / 2, z: Math.PI / 2});
      setScale(4);
      
    } else if (fileName.includes("H2")) {
      setRotation({x: 0, y: Math.PI / 2, z: 0});
      setScale(3);
      setOffset([0.4, 0.4, 0.4])

    } else if (fileName.includes("Cl2")) {
      setRotation({x: 0, y: Math.PI / 2, z: 0});
      setScale(4.5);
      setOffset([0.0, 0.4, 0.0])

    } else if (fileName.includes("HCl")) {
      setRotation({x: 0, y: -Math.PI / 2, z: 0});
      setScale(4.5);
      setOffset([0.0, 0.4, isHomo ? 2.8 : 0.8]);
    }
  }, [isHomo, fileName]);

  useEffect(() => {
    if (gltf) {
      scene.add(gltf);
      
      gltf.traverse((child) => { // traverse the loaded scene object
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
          child.material = new THREE.MeshBasicMaterial({
            wireframe: true,
            color: 0xffffff,
            transparent: true,
            opacity: 0.1
          });
        }
      })

      // Apply transformations
      gltf.rotation.set(rotation.x, rotation.y, rotation.z);
      gltf.scale.set(scale, scale, scale);
      gltf.position.set(offset[0], offset[1], offset[2]);
    }
  }, [gltf, rotation, scale, offset]);

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = '#1c2e4a';

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(getCameraPosition(props.element).fov, width / height, 0.01, 1000);
    camera.position.set(...getCameraPosition(props.element).position);

    setCamera(camera);

    scene = setUpScene(sceneColor);
    scene = addParticles(scene, props.element, props.density_data, props.density_data2, props.vmax, props.vmin);
    setFileName(`${props.element}_HOMO_GLTF`);

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

  return (
    <>
      {props.element !== undefined && (
        <>
          <View style={styles.container}>
            <Text style={styles.title}>{moleculeDict[props.element][0] + "."}</Text>
            <Text style={styles.description}>{moleculeDict[props.element][1]}</Text>
            <SegmentedControl />
          </View>

          <OrbitControlsView style={{ flex: 1 }} camera={camera}>
            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
          </OrbitControlsView>

          <HSLColorBarLegend />

          <View style={styles.container2}>
            <Text style={styles.description}>{ moleculeDict[props.element][2] + " | " + moleculeDict[props.element][4] + " | " +  moleculeDict[props.element][6] + " hybrid"}</Text>
          </View>
        </>
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

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#394d6d",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },

  container2: {
    backgroundColor: "black",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  secondaryContainer: {
    backgroundColor: "black",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  secondaryContainerAlternative: {
    backgroundColor: 'black',
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
  },

  title: {
    fontSize: 30,
    fontFamily: "Outfit_600SemiBold",
    color: "#bae6fd",
    textAlign: "center",
    marginBottom: 10,
  },

  description: {
    fontSize: 20,
    fontFamily: "Outfit_400Regular",
    color: "#fff",
    textAlign: "center",
  },
  barContainer: {
    flexDirection: "row",
    height: 25,
    overflow: "hidden",
  },
  colorBar: {
    flex: 1,
  },
  label: {
    fontSize: 12,
    textAlign: "center",
    marginTop: 5,
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Featurer);
