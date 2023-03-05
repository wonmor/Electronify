/*
TUTORIAL TO INSTANCING IN THREEJS AND WEBGL:
https://medium.com/@pailhead011/instancing-with-three-js-36b4b62bc127
*/

import * as THREE from 'three';

import { getMoleculeColour, getAtomColour, normalizeData } from './Globals';

export const addParticles = (scene, element, density_data, density_data2, vmax, vmin) => {
    // create geometry for the ball
    const geometry = new THREE.SphereGeometry(0.025, 32, 32);

    // create material for the ball
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // create an array to store the colors of the balls
    const colors = [];

    // create an array to store the matrix data for the balls
    const matrices = [];

    // create a loop to iterate over the desired number of balls
    for (const [key, value] of Object.entries(density_data)) {
        const coords = key.split(", ");

        // Normalize the density data in range from 0 to 1...
        const volume = normalizeData(value, vmax, vmin);

        // get the color of the ball based on the volume
        colors.push(getMoleculeColour(element, volume));

        // Phase shift and scale the coordinates to match the existing molecule shape that is already generated....
        const x = coords[0] / 5 - 10.7;
        const y = coords[1] / 5 - 10.7;
        const z = coords[2] / 5 - 10.7;

        // create a new matrix to hold the position of the ball
        const matrix = new THREE.Matrix4().makeTranslation(x, y, z);

        // add the matrix to the array of matrices
        matrices.push(matrix);
    }

    // create an instanced mesh using the ball geometry and material
    const instancedMesh = new THREE.InstancedMesh(geometry, material, matrices.length);

    // set the matrices and colors for each instance in the instanced mesh
    for (let i = 0; i < matrices.length; i++) {
        instancedMesh.setMatrixAt(i, matrices[i]);
        instancedMesh.setColorAt(i, new THREE.Color(colors[i]));
    }

    // update the instance matrices and colors
    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.instanceColor.needsUpdate = true;

    // add the instanced mesh to the scene
    scene.add(instancedMesh);

    return scene;
}

export const addAtomParticles = (scene, element, x_coords, y_coords, z_coords) => {
    // create geometry for the ball
    const geometry = new THREE.SphereGeometry(0.025, 32, 32);

    // create material for the ball
    const material = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // create an array to store the colors of the balls
    const colors = [];

    // create an array to store the matrix data for the balls
    const matrices = [];

    // create a loop to iterate over the desired number of balls
    for (let i = 0; i < x_coords.length; i++) {
        // get the color of the ball based on the volume
        colors.push(getAtomColour(element));

        // Phase shift and scale the coordinates to match the existing molecule shape that is already generated....
        const x = x_coords[i] / 10 - 8;
        const y = y_coords[i] / 10 - 8;
        const z = z_coords[i] / 10 - 8;

        // create a new matrix to hold the position of the ball
        const matrix = new THREE.Matrix4().makeTranslation(x, y, z);

        // add the matrix to the array of matrices
        matrices.push(matrix);
    }

    // create an instanced mesh using the ball geometry and material
    const instancedMesh = new THREE.InstancedMesh(geometry, material, matrices.length);

    // set the matrices and colors for each instance in the instanced mesh
    for (let i = 0; i < matrices.length; i++) {
        instancedMesh.setMatrixAt(i, matrices[i]);
        instancedMesh.setColorAt(i, new THREE.Color(colors[i]));
    }

    // update the instance matrices and colors
    instancedMesh.instanceMatrix.needsUpdate = true;
    instancedMesh.instanceColor.needsUpdate = true;

    // add the instanced mesh to the scene
    scene.add(instancedMesh);

    return scene;
}
