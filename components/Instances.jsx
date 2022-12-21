/*
TUTORIAL TO INSTANCING IN THREEJS AND WEBGL:
https://medium.com/@pailhead011/instancing-with-three-js-36b4b62bc127
*/

import * as THREE from 'three';

import { getMoleculeColour, normalizeData, hslToRgb } from './Globals';

export const addParticles = (scene, density_data, density_data2, vmax, vmin, xdim, ydim, zdim, no_of_atoms) => {
    // create geometry for the ball
    const geometry = new THREE.SphereGeometry(0.05, 32, 32);

    // create material for the ball
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // create a mesh for the ball
    const ball = new THREE.Mesh(geometry, material);

    // create an array to store the ball meshes
    const ballMeshes = [];

    // create a loop to iterate over the desired number of balls
    for (const [key, value] of Object.entries(
        density_data
      )) {
        // create a new ball mesh
        const ballMesh = ball.clone();

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
        const rgbValue = hslToRgb(color[0], color[1], color[2]);

        // set the position of the ball to a random x, y, and z value within a certain range
        ballMesh.position.set(x, y, z);

        // set the color of the ball to a random value
        ballMesh.material.color.setRGB(rgbValue[0], rgbValue[1], rgbValue[2])

        // add the ball to the array of ball meshes
        ballMeshes.push(ballMesh);
    }

    // create an instanced mesh using the ball mesh as the base geometry
    const instancedMesh = new THREE.InstancedMesh(ball.geometry, ball.material, ballMeshes.length);

    for (let i = 0; i < ballMeshes.length; i++) {
        ballMeshes[i].updateMatrix();

        instancedMesh.setMatrixAt(i, ballMeshes[i].matrix);
    }

    instancedMesh.instanceMatrix.needsUpdate = true;

    // add the instanced mesh to the scene
    scene.add(instancedMesh);

    return scene;
}