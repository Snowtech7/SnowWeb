import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

const services = {
    'ventas': {
        title: 'Ventas',
        desc: 'Gestión comercial, pipeline de oportunidades y cierre de negocios automatizado.',
        path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.16-1.46-3.27-3.4h1.96c.1 1.05.82 1.87 2.65 1.87 1.96 0 2.4-.98 2.4-1.59 0-.83-.44-1.61-2.67-2.14-2.48-.6-4.18-1.62-4.18-3.67 0-1.72 1.39-2.84 3.11-3.21V4h2.67v1.95c1.86.45 2.79 1.86 2.85 3.39H14.3c-.05-1.11-.64-1.87-2.22-1.87-1.5 0-2.4.68-2.4 1.64 0 .84.65 1.39 2.67 1.91s4.18 1.39 4.18 3.91c-.01 1.83-1.38 2.83-3.12 3.16z"
    },
    'marketing': {
        title: 'Marketing',
        desc: 'Campañas, branding, generación de leads y análisis de mercado centralizado.',
        path: "M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z"
    },
    'operaciones': {
        title: 'Operaciones',
        desc: 'Procesos internos, logística, inventario y gestión de la cadena de valor.',
        path: "M19.14 12.94c.04-.31.06-.63.06-.94 0-.31-.02-.63-.06-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.04.31-.06.63-.06.94s.02.63.06.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z"
    },
    'finanzas': {
        title: 'Finanzas',
        desc: 'Control financiero, presupuestos, facturación y reportes en tiempo real.',
        path: "M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
    },
    'rrhh': {
        title: 'RRHH',
        desc: 'Gestión de talento, onboarding, desarrollo profesional y clima organizacional.',
        path: "M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
    },
    'tecnologia': {
        title: 'Tecnología',
        desc: 'Infraestructura digital, desarrollo, integraciones y seguridad informática.',
        path: "M20 18c1.1 0 1.99-.9 1.99-2L22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2H0v2h24v-2h-4zM4 6h16v10H4V6z"
    }
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
        { class: 'face-original f-front', content: 'ventas', rot: [0, 0, 0], pos: [0, 0, 125] },
        { class: 'face-original f-back', content: 'marketing', rot: [0, Math.PI, 0], pos: [0, 0, -125] },
        { class: 'face-original f-right', content: 'operaciones', rot: [0, -Math.PI / 2, 0], pos: [-125, 0, 0] },
        { class: 'face-original f-left', content: 'finanzas', rot: [0, Math.PI / 2, 0], pos: [125, 0, 0] },
        { class: 'face-original f-top', content: 'rrhh', rot: [-Math.PI / 2, 0, 0], pos: [0, 125, 0] },
        { class: 'face-original f-bottom', content: 'tecnologia', rot: [Math.PI / 2, 0, 0], pos: [0, -125, 0] }
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
            gs = isActive ? (isDesktop ? 0.01 : 0.008) : 0;
        }
    } else {
        // Home page logic
        const relIndex = 2 - physics.activeSection;
        gx = (physics.activeSection === 2) ? 0 : 0;
        gy = isActive ? (isDesktop ? 0 : -1.5) : (relIndex * -15);
        gs = isActive ? (isDesktop ? 0.01 : 0.008) : 0;
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
