    import * as THREE from 'three';
import { CSS3DObject } from 'three/addons/renderers/CSS3DRenderer.js';

export function createPartnerSystem(cssScene) {
    if (!cssScene) return null;
    const group = new THREE.Group();
    const partners = ["AWS", "META", "GOOGLE", "AZURE", "OPENAI"];
    const positions = [{ x: -400, y: 50, z: 0 }, { x: -200, y: -100, z: 50 }, { x: 0, y: 150, z: -50 }, { x: 200, y: -100, z: 50 }, { x: 400, y: 50, z: 0 }];
    partners.forEach((name, i) => {
        const div = document.createElement('div');
        div.className = 'partner-orb interactive-3d';
        div.innerHTML = `<span class="partner-text">${name}</span>`;
        const obj = new CSS3DObject(div);
        obj.position.set(positions[i].x, positions[i].y, positions[i].z);
        group.add(obj);
    });
    group.scale.set(0.01, 0.01, 0.01);
    cssScene.add(group);
    return group;
}

export function updatePartners(partnerGroup, physics, isServicesPage, now, isDesktop = true) {
    if (!partnerGroup) return;

    if (isServicesPage) {
        partnerGroup.scale.set(0, 0, 0);
    } else {
        const isActive = physics.activeSection === 5;
        const relIndex = 5 - physics.activeSection;
        let gy = isActive ? (isDesktop ? 0 : 0.5) : (relIndex * -15);
        let gs = isActive ? 0.01 : 0;

        partnerGroup.position.y += (gy - partnerGroup.position.y) * 0.08;
        const cs = partnerGroup.scale.x;
        const ns = cs + (gs - cs) * 0.08;
        partnerGroup.scale.set(ns, ns, ns);

        partnerGroup.rotation.y += 0.002;
        partnerGroup.rotation.x = Math.sin(now * 0.0005) * 0.1;
        partnerGroup.children.forEach(c => c.rotation.y = -partnerGroup.rotation.y);
    }
}
