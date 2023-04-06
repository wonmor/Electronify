import { GLView } from "expo-gl";
import { Renderer } from "expo-three";

import { useState, useEffect } from "react";
import { connect, useDispatch } from "react-redux";
import { View, Text, StyleSheet } from "react-native";

import { Line2, LineGeometry, LineMaterial } from 'three-fatline';
import { resetState } from "./utils/actions";

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

import { addParticles } from "./Instances";
import { moleculeDict, bondShapeDict, dipoleMomentDict } from "./Globals";

/*
ELECTRONIFY: A React Native App for Visualizing Quantum Mechanics
Developed and Designed by John Seong
--------------------------------------------------------------------
BELOW IS THE MAIN RENDERER FOR THE THREE.JS SCENE
*/

const HSLColorBarLegend = () => {
  return (
    <View style={[styles.barContainer, { fontFamily: "Outfit_600SemiBold"}]}>
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

  let timeout;

  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => {
      dispatch(resetState());
      clearTimeout(timeout);
    };
  }, []);

  const addBallAndStick = (scene) => {
    const ball = new BallMesh(0.25);

    props.atoms_x.forEach((x_coord, index) => {
      const atom = ball.clone();

      atom.position.set(x_coord, props.atoms_y[index], props.atoms_z[index]);
      scene.add(atom);
    });

    {Object.values(
      bondShapeDict[props.element]
    ).map((value) => {
      const geometry = new LineGeometry();
      
      geometry.setPositions([props.atoms_x[value[0]], props.atoms_y[value[0]], props.atoms_z[value[0]], props.atoms_x[value[1]], props.atoms_y[value[1]], props.atoms_z[value[1]]]);
      
      const material = new LineMaterial({
        color: 'pink',
        transparent: true,
        opacity: 0.5,
        linewidth: 10, // px
        resolution: new THREE.Vector2(640, 480) // resolution of the viewport
        // dashed, dashScale, dashSize, gapSize
      });
  
      const stick = new Line2(geometry, material);
  
      stick.computeLineDistances();
  
      scene.add(stick);
  
    })}
    
    return scene;
  };

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = '#1c2e4a';

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    setCamera(camera);

    let scene = setUpScene(sceneColor);

    scene = addBallAndStick(scene);
    scene = addParticles(scene, props.element, props.density_data, props.density_data2, props.vmax, props.vmin);

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
          </View>

          <OrbitControlsView style={{ flex: 1 }} camera={camera}>
            <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
          </OrbitControlsView>

          <View style={styles.secondaryContainerAlternative}>
            <Text style={styles.description}>Electron Density</Text>
          </View>

          <HSLColorBarLegend />

          <View style={styles.container2}>
            <Text style={styles.description}>{ moleculeDict[props.element][2] + " | " + moleculeDict[props.element][4] + " | " +  moleculeDict[props.element][6]}</Text>
          </View>

          <View style={styles.secondaryContainer}>
            <Text style={styles.description}>Drag or zoom using your finger.</Text>
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
    backgroundColor: "#1c2e4a",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
  },

  secondaryContainerAlternative: {
    backgroundColor: '#4f617d',
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
    height: 20,
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
