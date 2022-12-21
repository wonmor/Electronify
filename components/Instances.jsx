/*
TUTORIAL TO INSTANCING IN THREEJS AND WEBGL:
https://medium.com/@pailhead011/instancing-with-three-js-36b4b62bc127
*/

import * as THREE from 'three';

import { getMoleculeColour, normalizeData, hslToRgb } from './Globals';

export const addParticles = (scene, density_data, density_data2, vmax, vmin, xdim, ydim, zdim) => {
    // Create the instanced geometry
    const geometry = new THREE.BufferGeometry(0.2, 0.2, 0.2);

    const instanceMatrix = new THREE.InstancedBufferAttribute(new Float32Array(xdim, ydim, zdim));
    const instanceColors = new THREE.InstancedBufferAttribute(new Float32Array(xdim, ydim, zdim));

    let count = 0;
    
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
        const x = coords[0] / 10 - 10.7;
        const y = coords[1] / 10 - 10.7;
        const z = coords[2] / 10 - 10.7;

        const color = getMoleculeColour(volume);
        const rgbValue = hslToRgb(color[0], color[1], color[2]);
        
        instanceColors.setXYZ(count, rgbValue[0], rgbValue[1], rgbValue[2]);
        instanceMatrix.setXYZ(count, x, y, z);

        count++;
    }

    instanceMatrix.needsUpdate = true;
    instanceColors.needsUpdate = true;

    geometry.setAttribute('instanceMatrix', instanceMatrix);
    geometry.setAttribute('instanceColor', instanceColors);

    const material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });

    material.needsUpdate = true;

    // Create the instanced mesh and add it to the scene
    const mesh = new THREE.Mesh(geometry, material);
    
    scene.add(mesh);

    return scene;
}