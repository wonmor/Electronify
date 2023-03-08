import * as THREE from 'three';

import { getMoleculeColour, getAtomColour, normalizeData } from './Globals';

const sphereGeometry = new THREE.SphereGeometry(0.025, 32, 32);
const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

const addParticles = (scene, element, density_data, density_data2, vmax, vmin) => {
    const matrices = [];
    const colors = [];

    for (const [key, value] of Object.entries(density_data)) {
        const coords = key.split(", ");

        const volume = normalizeData(value, vmax, vmin);

        colors.push(getMoleculeColour(element, volume));

        const x = coords[0] / 5 - 10.7;
        const y = coords[1] / 5 - 10.7;
        const z = coords[2] / 5 - 10.7;

        const matrix = new THREE.Vector3(x, y, z);

        matrices.push(matrix);
    }

    const geometry = new THREE.BufferGeometry().setFromPoints(matrices);

    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        vertexColors: THREE.VertexColors,
        size: 0.2,
    });

    const pointCloud = new THREE.Points(geometry, material);

    scene.add(pointCloud);

    return scene;
}


const addAtomParticles = (scene, element, x_coords, y_coords, z_coords) => {
    const matrices = [];
    const colors = [];

    for (let i = 0; i < x_coords.length; i++) {
        colors.push(getAtomColour(element));

        const x = x_coords[i] / 10 - 8;
        const y = y_coords[i] / 10 - 8;
        const z = z_coords[i] / 10 - 8;

        const matrix = new THREE.Matrix4().makeTranslation(x, y, z);

        matrices.push(matrix);
    }

    const bufferGeometry = new THREE.BufferGeometry().fromGeometry(sphereGeometry);
    const position = bufferGeometry.getAttribute('position');
    bufferGeometry.addAttribute('instanceMatrix', new THREE.InstancedBufferAttribute(new Float32Array(matrices.length * 16), 16));
    bufferGeometry.addAttribute('color', new THREE.InstancedBufferAttribute(new Float32Array(colors), 3));

    const instancedMesh = new THREE.Mesh(bufferGeometry, sphereMaterial);
    instancedMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    instancedMesh.instanceColor.setUsage(THREE.DynamicDrawUsage);
    instancedMesh.geometry.maxInstancedCount = matrices.length;
    
    for (let i = 0; i < matrices.length; i++) {
        instancedMesh.setMatrixAt(i, matrices[i]);
    }
    
    scene.add(instancedMesh);
    
    return scene;
}

export { addParticles, addAtomParticles };
