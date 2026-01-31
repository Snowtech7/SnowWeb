import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const services = {
    'web': { title: 'Desarrollo Web', desc: 'Sitios corporativos y PWAs.', path: "M7.41 16.59L2.83 12l4.58-4.59L6 6l-6 6 6 6 1.41-1.41zM16.59 16.59L21.17 12l-4.58-4.59L18 6l6 6-6 6-1.41-1.41zM12.41 4.58L11 6l-4 12 1.41 1.41L13.83 6z" },
    'marketing': { title: 'Marketing', desc: 'Growth y estrategias.', path: "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z" },
    'chatbots': { title: 'ChatBots', desc: 'Automatización con AI.', path: "M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9.5 10c.83 0 1.5.67 1.5 1.5S10.33 13 9.5 13s-1.5-.67-1.5-1.5S8.67 10 9.5 10zm5 0c.83 0 1.5.67 1.5 1.5S15.33 13 14.5 13s-1.5-.67-1.5-1.5S13.67 10 14.5 10z" },
    'design': { title: 'Diseño', desc: 'UI/UX de alto nivel.', path: "M7 14c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3zM18.71.29c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.54 3.54 1.83-1.83c.39-.39.39-1.02 0-1.41l-2.12-2.13zM14.06 4.94L3 16.01V20h3.99l11.07-11.07-3.99-3.99z" },
    'auto': { title: 'Workflow', desc: 'Automatización n8n.', path: "M19.44 12.99l-2.54-.29c-.1-.98-.4-1.92-.85-2.78l1.6-1.95c.53-.64.42-1.58-.26-2.12l-1.41-1.41c-.63-.53-1.58-.42-2.12.26l-1.95 1.6c-.86-.45-1.8-.75-2.78-.85l-.29-2.54C9.06 2.43 8.24 2 7.5 2h-2c-.74 0-1.56.43-1.72 1.01l-.29 2.54c-.98.1-1.92.4-2.78.85l-1.95-1.6c-.64-.53-1.58-.42-2.12.26L1.22 6.44c-.53.63-.42 1.58.26 2.12l1.6 1.95c-.45.86-.75 1.8-.85 2.78l-2.54.29C-1.06 13.57 0 15 1.5 15h18c1.5 0 2.56-1.43 2.44-2.01zM12 15c-1.66 0-3-1.34-3-3s1.34 3 3-3 3 1.34 3 3-1.34 3-3 3z" },
    'funnels': { title: 'Funnels', desc: 'Conversión.', path: "M3 4h18v2H3zM6 9h12v2H6zM10 14h4v2h-4z" }
};

let isHovering = false;
let cssGroup = null;

// Initialize global modal handlers
window.closeModal = () => document.getElementById('service-modal').classList.remove('open');
window.openService = (key) => {
    const data = services[key];
    document.getElementById('modal-title').innerText = data.title;
    document.getElementById('modal-desc').innerText = data.desc;
    const svgPath = `<svg viewBox="0 0 24 24" style="width:100%;height:100%;fill:#00f0ff;"><path d="${data.path}"/></svg>`;
    document.getElementById('modal-icon-container').innerHTML = svgPath;
    document.getElementById('service-modal').classList.add('open');
};

export function createCSSCube(cssScene) {
    if (!cssScene) return null;
    const group = new THREE.Group();
    const faces = [
        { class: 'face-original f-front', content: 'web', rot: [0, 0, 0], pos: [0, 0, 125] },
        { class: 'face-original f-back', content: 'marketing', rot: [0, Math.PI, 0], pos: [0, 0, -125] },
        { class: 'face-original f-right', content: 'chatbots', rot: [0, -Math.PI / 2, 0], pos: [-125, 0, 0] },
        { class: 'face-original f-left', content: 'design', rot: [0, Math.PI / 2, 0], pos: [125, 0, 0] },
        { class: 'face-original f-top', content: 'auto', rot: [-Math.PI / 2, 0, 0], pos: [0, 125, 0] },
        { class: 'face-original f-bottom', content: 'funnels', rot: [Math.PI / 2, 0, 0], pos: [0, -125, 0] }
    ];
    faces.forEach(f => {
        const div = document.createElement('div');
        div.className = 'cube-wrapper ' + f.class;
        const data = services[f.content];
        div.innerHTML = `<div class="content-inner"><div class="icon-inner"><svg viewBox="0 0 24 24"><path d="${data.path}"/></svg></div><span class="text-inner">${data.title.split(' ')[0]}</span></div>`;
        div.onclick = () => window.openService(f.content);
        div.addEventListener('mouseenter', () => isHovering = true);
        div.addEventListener('mouseleave', () => isHovering = false);
        const obj = new CSS3DObject(div);
        obj.position.set(...f.pos); obj.rotation.set(...f.rot); group.add(obj);
    });
    group.scale.set(0.01, 0.01, 0.01);
    cssScene.add(group);
    cssGroup = group;
    return group;
}

export function updateCube(physics, isServicesPage, now, isDesktop = true) {
    if (!cssGroup) return;

    // Logic: 
    // If Services page -> Visible only in section 0
    // If Home page -> Logic based on section 2

    const isActive = isServicesPage ? (physics.activeSection === 1) : (physics.activeSection === 2);

    let gx = 0;
    let gy = 0;
    let gs = 0;

    if (isServicesPage) {
        if (physics.activeSection === 1) {
            gx = 0;
            gy = 0; // Centered in its own section
            gs = 0.01;
        } else if (physics.activeSection === 0) {
            // Below the screen or small when at the title
            gx = 0;
            gy = -15;
            gs = 0;
        } else {
            // Fly away
            gx = 0;
            gy = 20;
            gs = 0;
        }
    } else {
        // Home page logic
        const relIndex = 2 - physics.activeSection;
        gx = (physics.activeSection === 2) ? 0 : 0;
        gy = isActive ? (isDesktop ? 0 : -0.5) : (relIndex * -15);
        gs = isActive ? 0.01 : 0;
    }

    cssGroup.position.x += (gx - cssGroup.position.x) * 0.08;
    cssGroup.position.y += (gy - cssGroup.position.y) * 0.08;
    const cs = cssGroup.scale.x;
    const ns = cs + (gs - cs) * 0.08;
    cssGroup.scale.set(ns, ns, ns);

    if (!isHovering) {
        cssGroup.rotation.y += 0.003;
        cssGroup.rotation.x = Math.sin(now * 0.0005) * 0.2;
    }
}
