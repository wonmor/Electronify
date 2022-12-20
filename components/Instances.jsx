/*
TUTORIAL TO INSTANCING IN THREEJS AND WEBGL:
https://medium.com/@pailhead011/instancing-with-three-js-36b4b62bc127
*/

import * as THREE from 'three';

import { getMoleculeColour, normalizeData } from './Globals';

export const addParticles = (scene, density_data, density_data2, vmax, vmin) => {
    // Create the instanced geometry
    const geometry = new THREE.BufferGeometry(0.2, 0.2, 0.2);

    const count = 100;

    const instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(count * 16), 16, 1);
    const instanceColors = new THREE.InstancedBufferAttribute(new Float32Array(count * 3), 3, 1);
    
    for (const [key, value] of Object.entries(
        density_data
      )) {
        const coords = key.split(", ");

        // Normalize the density data in range from 0 to 1...
        const volume = normalizeData(
            value,
            vmax,
            vmin
        );
        
        // Phase shift and scale the coordinates to match the existing molecule shape that is already generated....
        const x = coords[0] / 5 - 10.7;
        const y = coords[1] / 5 - 10.7;
        const z = coords[2] / 5 - 10.7;

        const color = getMoleculeColour(volume);
        
        instanceColors.setXYZ(i, color.r, color.g, color.b);
        instanceMatrix.setXYZ(i, x, y, z);
    }

    geometry.setAttribute('instanceMatrix', instanceMatrix);
    geometry.setAttribute('instanceColor', instanceColors);

    const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

    // Create the instanced mesh and add it to the scene
    const mesh = new THREE.Mesh(geometry, material);
    
    scene.add(mesh);

    return scene;
}