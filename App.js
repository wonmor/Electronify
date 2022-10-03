import { GLView } from "expo-gl";
import { Renderer, TextureLoader } from "expo-three";
import { useEffect } from "react";
import {
  AmbientLight,
  BoxBufferGeometry,
  Fog,
  GridHelper,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SpotLight,
} from "three";

import { Renderer } from './components/Renderer';

export default function App() {
  return (
    <Renderer />
  )
}
