import * as THREE from 'three';

import { getMoleculeColour, getAtomColour, normalizeData } from './Globals';

const convertHSLStringToArray = (hslString) => {
    const color = new THREE.Color(hslString);
    return [normalizeData(color.r, 1, 0), normalizeData(color.g, 1, 0), normalizeData(color.b, 1, 0)];
};

const addParticles = (scene, element, density_data, density_data2, vmax, vmin) => {
    const matrices = [];
    const colors = [];

    for (const [key, value] of Object.entries(density_data)) {
        const coords = key.split(", ");

        const volume = normalizeData(value, vmax, vmin);

        colors.push(...convertHSLStringToArray(getMoleculeColour(element, volume)));

        const x = coords[0] / 5 - 10.7;
        const y = coords[1] / 5 - 10.7;
        const z = coords[2] / 5 - 10.7;

        const matrix = new THREE.Vector3(x, y, z);

        matrices.push(matrix);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(matrices);

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 5.0,
        sizeAttenuation: false,
    });

    const pointCloud = new THREE.Points(geometry, material);

    scene.add(pointCloud);

    return scene;
};

const addAtomParticles = (scene, element, x_coords, y_coords, z_coords) => {
    const matrices = [];
    const colors = [];

    for (let i = 0; i < x_coords.length; i++) {
        colors.push(...convertHSLStringToArray(getAtomColour(element)));

        const y = x_coords[i] / 7;
        const x = y_coords[i] / 7;
        const z = z_coords[i] / 7;

        const matrix = new THREE.Vector3(x, y, z);

        matrices.push(matrix);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(matrices);

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 5.0,
        sizeAttenuation: false,
    });

    const pointCloud = new THREE.Points(geometry, material);

    scene.add(pointCloud);

    return scene;
};

export { addParticles, addAtomParticles };
