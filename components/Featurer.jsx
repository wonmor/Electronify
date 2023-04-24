import { GLView } from "expo-gl";
import { Renderer } from "expo-three";

import React, { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { View, Text, StyleSheet } from "react-native";
import { resetState } from "./utils/actions";

import SegmentedControlTab from 'react-native-segmented-control-tab';
import OrbitControlsView from "./controls/OrbitControlsView";

import {
  AmbientLight,
  Fog,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
  SphereGeometry,
} from "three";

import * as Haptics from 'expo-haptics';

import { addParticles } from "./Instances";
import { moleculeDict, getCameraPosition, GLBViewer } from "./Globals";

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
  const [selectedIndex, setSelectedIndex] = useState(0); 
  const [isHomo, setIsHomo] = useState(true);

  const dispatch = useDispatch();

  let timeout, scene;

  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => {
      dispatch(resetState());
      clearTimeout(timeout);
    };
  }, []);

  useEffect(() => {
    if (selectedIndex == 0) {
      setIsHomo(true);
      
    } else {
      setIsHomo(false);
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (scene) {
      scene.remove(scene.children[scene.children.length - 1])

      const prompt = isHomo ? "_HOMO" : "_LUMO";
      const glbViewer = new GLBViewer({ name: props.element + prompt, isHomo: isHomo });

      scene.add(glbViewer)
    }
  }, [isHomo])

  const updateGLBViewerAndScene = () => {
    // Remove the old GLBViewer from the scene
    const oldGLBViewer = scene.getObjectByName("GLBViewer");
    if (oldGLBViewer) {
      scene.remove(oldGLBViewer);
    }
  
    // Create a new GLBViewer with the updated isHomo value
    const prompt = isHomo ? "_HOMO" : "_LUMO";
    const newGLBViewer = new GLBViewer({ name: props.element + prompt, isHomo: isHomo });
    newGLBViewer.name = "GLBViewer";
  
    // Add the new GLBViewer back to the scene
    scene.add(newGLBViewer);
  };
  

  const handleSingleIndexSelect = (index) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedIndex(index);
  };

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

    const prompt = isHomo ? "_HOMO" : "_LUMO";
    const glbViewer = new GLBViewer({ name: props.element + prompt, isHomo: isHomo });

    scene = addParticles(scene, props.element, props.density_data, props.density_data2, props.vmax, props.vmin);
    scene.add(glbViewer);

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
            <View style={styles.segmentedControlContainer}>
              <SegmentedControlTab
                values={['HOMO', 'LUMO']}
                selectedIndex={selectedIndex}
                tabStyle={styles.tabStyle}
                tabTextStyle={{ fontFamily: "Outfit_600SemiBold", color: "#0073B2" }}
                activeTabStyle={styles.activeTabStyle}
                onTabPress={handleSingleIndexSelect}
              />
            </View>
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

class BallMesh extends Mesh {
  constructor(radius = 0.5) {
    super(
      new SphereGeometry(radius, 32, 32),
      new MeshBasicMaterial( { color: "#fff", transparent: true, opacity: 0.5 } )
    );
  }
}

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

  segmentedControlContainer: {
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
  tabStyle: {
    borderColor: '#0073B2',
  },
  activeTabStyle: {
    backgroundColor: '#0073B2',
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