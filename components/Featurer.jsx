import { GLView } from "expo-gl";
import { Renderer } from "expo-three";

import { useState, useEffect } from "react";
import { connect } from "react-redux";
import { View, Text, StyleSheet } from "react-native";

import { Line2, LineGeometry, LineMaterial } from 'three-fatline';

import OrbitControlsView from "./controls/OrbitControlsView";

import {
  Vector3,
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
  TubeGeometry,
} from "three";

import { addParticles } from "./Instances";

/*
ELECTRONIFY: A React Native App for Visualizing Quantum Mechanics
Developed and Designed by John Seong
--------------------------------------------------------------------
BELOW IS THE MAIN RENDERER FOR THE THREE.JS SCENE
*/

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
  const [coords, setCoords] = useState([]);

  let timeout;

  useEffect(() => {
    // Clear the animation loop when the component unmounts
    return () => clearTimeout(timeout);
  }, []);

  const addBallAndStick = (scene) => {
    const ball = new BallMesh(0.5);

    props.atoms_x.forEach((x_coord, index) => {
      setCoords(coords.push(x_coord, props.atoms_y[index], props.atoms_z[index]));

      const atom = ball.clone();

      atom.position.set(x_coord, props.atoms_y[index], props.atoms_z[index]);
      scene.add(atom);
    });

    const geometry = new LineGeometry();
    
    geometry.setPositions(coords); // [ x1, y1, z1,  x2, y2, z2, ... ] format

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
    
    return scene;
  };

  const onContextCreate = async (gl) => {
    const { drawingBufferWidth: width, drawingBufferHeight: height } = gl;
    const sceneColor = '#394d6d';

    // Create a WebGLRenderer without a DOM element
    const renderer = new Renderer({ gl });
    renderer.setSize(width, height);
    renderer.setClearColor(sceneColor);

    const camera = new PerspectiveCamera(70, width / height, 0.01, 1000);
    camera.position.set(2, 5, 5);

    setCamera(camera);

    let scene = setUpScene(sceneColor);

    scene = addBallAndStick(scene);
    scene = addParticles(scene, props.element, props.density_data, props.density_data2, props.vmax, props.vmin, props.xdim, props.ydim, props.zdim, props.no_of_atoms);

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
      <View style={styles.container}>
        <Text style={styles.title}>Hydrogen Gas.</Text>
        <Text style={styles.description}>Hydrogen is the lightest element. At standard conditions hydrogen is a gas of diatomic molecules having the formula H2.</Text>
      </View>

      <OrbitControlsView style={{ flex: 1 }} camera={camera}>
        <GLView style={{ flex: 1 }} onContextCreate={onContextCreate} />
      </OrbitControlsView>

      <View style={styles.secondaryContainer}>
        <Text style={styles.description}>Drag or zoom using your finger...</Text>
      </View>
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
    justifyContent: "top",
    padding: 20,
  },

  secondaryContainer: {
    backgroundColor: "#1c2e4a",
    width: "100%",
    alignItems: "center",
    justifyContent: "top",
    padding: 10,
    paddingBottom: 30,
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Featurer);
