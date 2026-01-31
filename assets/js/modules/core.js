import * as THREE from 'three';
import { CSS3DRenderer } from 'three/addons/renderers/CSS3DRenderer.js';

export const state = {
    renderer: null,
    scene: null,
    camera: null,
    cssRenderer: null,
    cssScene: null,
    iceMat: null
};

export function initCore(container3D, cssContainer) {
    // Shared Camera (needed for both)
    state.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    state.camera.position.z = 14;

    // --- WEBGL ---
    if (container3D) {
        state.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        state.renderer.setPixelRatio(window.devicePixelRatio);
        state.renderer.setSize(window.innerWidth, window.innerHeight);
        state.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        container3D.appendChild(state.renderer.domElement);

        state.scene = new THREE.Scene();
        state.scene.fog = new THREE.FogExp2(0x02040a, 0.03);

        // Access via state.camera

        state.scene.add(new THREE.AmbientLight(0x406080, 2));
        const mainLight = new THREE.DirectionalLight(0xffffff, 3);
        mainLight.position.set(5, 5, 5);
        state.scene.add(mainLight);

        const rimLight = new THREE.SpotLight(0x00d9ff, 15);
        rimLight.position.set(-5, 8, 2);
        rimLight.angle = Math.PI / 4;
        state.scene.add(rimLight);

        state.iceMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff, roughness: 0.1, metalness: 0.1, transmission: 0.95, thickness: 2.0,
            ior: 1.4, clearcoat: 1, attenuationColor: new THREE.Color(0xccf5ff), attenuationDistance: 3
        });
    }

    // --- CSS ---
    if (cssContainer) {
        state.cssRenderer = new CSS3DRenderer();
        state.cssRenderer.setSize(window.innerWidth, window.innerHeight);
        cssContainer.appendChild(state.cssRenderer.domElement);
        state.cssScene = new THREE.Scene();
    }
}

export function handleResize() {
    const w = window.innerWidth, h = window.innerHeight;
    if (state.camera) {
        state.camera.aspect = w / h;
        state.camera.updateProjectionMatrix();
    }
    if (state.renderer) state.renderer.setSize(w, h);
    if (state.cssRenderer) state.cssRenderer.setSize(w, h);
}
