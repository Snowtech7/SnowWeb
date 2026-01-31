import * as THREE from 'three';
import { initCore, state, handleResize as coreHandleResize } from './modules/core.js';
import { createCSSCube, updateCube } from './modules/cube.js';
import { createWebGLShape, createValuePropSystem, updateShapes } from './modules/shapes.js';
import { initParticles, updateParticles } from './modules/particles.js';
import { createPartnerSystem, updatePartners } from './modules/partners.js';

// --- CONFIG ---
const PHYSICS = { velocity: 0, lastScrollY: window.scrollY, lastInteract: Date.now(), activeSection: 0 };

// Global Source of Truth for Page Detect
const isServicesPage = document.body.classList.contains('page-services') || window.location.pathname.includes('services.html');

// --- SLIDERS ---
function initSlider(id) {
    let current = 0;
    const container = document.getElementById(id);
    if (!container) return;
    const slides = container.querySelectorAll('.slide-item');
    setInterval(() => {
        slides[current].classList.remove('active');
        current = (current + 1) % slides.length;
        slides[current].classList.add('active');
    }, 3500);
}
initSlider('market-slider');
initSlider('kpi-slider');

// --- INITIALIZATION ---
const container3D = document.getElementById('layer-webgl');
const cssContainer = document.getElementById('layer-css');
const canvasBg = document.getElementById('canvas-particles');
const ctx = canvasBg ? canvasBg.getContext('2d') : null;

// Init Core Three.js (Scene, Renderer, Camera)
initCore(container3D, cssContainer);

// Init Particles
let particles = initParticles(canvasBg);

// Init Shapes & Objects
let shapes = [];
let cssGroup = null;
let partnerGroup = null;

if (state.scene) {
    // Only create WebGL shapes if NOT on services page (Optimization)
    if (!isServicesPage) {
        shapes = [
            createWebGLShape(new THREE.IcosahedronGeometry(2.8, 4), 'sphere', state.scene, state.iceMat),
            createValuePropSystem(state.scene, state.iceMat),
            null, // Placeholder for Cube index (2)
            createWebGLShape(new THREE.OctahedronGeometry(2.7), 'octa', state.scene, state.iceMat),
            createWebGLShape(new THREE.DodecahedronGeometry(2.6), 'dodeca', state.scene, state.iceMat),
            null  // Placeholder for Partners index (5)
        ];
    }
}

if (state.cssScene) {
    // Cube is needed on both pages, but logic handles visibility
    cssGroup = createCSSCube(state.cssScene);

    // Partners only needed on Home, avoiding creation on Services
    if (!isServicesPage) {
        partnerGroup = createPartnerSystem(state.cssScene);
    }
}

// --- EVENTS ---
window.addEventListener('resize', () => {
    coreHandleResize();
    if (canvasBg) particles = initParticles(canvasBg); // Re-init particles on resize
});
coreHandleResize();

window.addEventListener('scroll', () => {
    const delta = window.scrollY - PHYSICS.lastScrollY;
    if (Math.abs(delta) > 0.5) PHYSICS.velocity += delta * 0.15;
    PHYSICS.velocity = Math.max(Math.min(PHYSICS.velocity, 60), -60);
    PHYSICS.lastScrollY = window.scrollY; PHYSICS.lastInteract = Date.now();
});

const observer = new IntersectionObserver(e => {
    const visibleSection = e.reduce((max, entry) => {
        return entry.intersectionRatio > max.intersectionRatio ? entry : max;
    }, e[0]);

    if (visibleSection && visibleSection.isIntersecting && visibleSection.intersectionRatio > 0.2) {
        PHYSICS.activeSection = parseInt(visibleSection.target.getAttribute('data-index'));
        document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
        visibleSection.target.classList.add('active');
        const fh = visibleSection.target.querySelector('.floating-header');
        if (fh) { fh.style.opacity = 1; fh.style.transform = 'translateY(0)'; }
    }
}, { threshold: [0.1, 0.3, 0.5, 0.7] });
document.querySelectorAll('section').forEach(s => observer.observe(s));

// --- ANIMATION LOOP ---
function animate() {
    requestAnimationFrame(animate);
    const now = Date.now();
    const isDesktop = window.innerWidth > 768;

    // 1. Physics Decay
    const idle = (now - PHYSICS.lastInteract) > 5000;
    PHYSICS.velocity *= idle ? 0.9 : 0.96;
    if (Math.abs(PHYSICS.velocity) < 0.05) PHYSICS.velocity = 0;

    // 2. Update Modules
    updateParticles(ctx, particles, PHYSICS, canvasBg);

    if (state.camera) {
        const targetCamZ = 14 + (Math.abs(PHYSICS.velocity) * 0.05);
        state.camera.position.z += (targetCamZ - state.camera.position.z) * 0.05;
    }

    updateShapes(shapes, PHYSICS, isServicesPage, isDesktop);
    updateCube(PHYSICS, isServicesPage, now, isDesktop); // Note: Cube logic is handled inside
    updatePartners(partnerGroup, PHYSICS, isServicesPage, now, isDesktop);

    // 3. Render
    // Only render WebGL if NOT services page or if we decide to show some WebGL there later
    if (!isServicesPage && state.renderer && state.scene && state.camera) {
        state.renderer.render(state.scene, state.camera);
    }

    if (state.cssRenderer && state.cssScene && state.camera) {
        state.cssRenderer.render(state.cssScene, state.camera);
    }
}
animate();
