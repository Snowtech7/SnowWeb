import * as THREE from 'three';

export function createWebGLShape(geo, type, scene, iceMat) {
    if (!scene) return null;
    const grp = new THREE.Group();
    grp.add(new THREE.Mesh(geo, iceMat));
    grp.add(new THREE.LineSegments(new THREE.EdgesGeometry(geo), new THREE.LineBasicMaterial({ color: 0x00d9ff, opacity: 0.3, transparent: true })));
    const pGeo = new THREE.BufferGeometry();
    const pos = new Float32Array(50 * 3);
    for (let i = 0; i < 150; i++) pos[i] = (Math.random() - 0.5) * 3.5;
    pGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    grp.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xffffff, size: 0.04, opacity: 0.5, transparent: true })));
    grp.userData = { type: type, parts: grp.children[2] };
    scene.add(grp);
    return grp;
}

export function createValuePropSystem(scene, iceMat) {
    if (!scene) return null;
    const container = new THREE.Group();
    const core = createWebGLShape(new THREE.TetrahedronGeometry(2.8), 'valueprop', scene, iceMat);
    // remove core from scene because we want it inside container
    scene.remove(core);
    container.add(core);

    const satellites = new THREE.Group();
    container.add(satellites);
    container.userData = { isValueSystem: true, satellites: satellites };
    const satGeo = new THREE.BoxGeometry(0.5, 0.5, 0.5);
    for (let i = 0; i < 3; i++) {
        const mesh = new THREE.Mesh(satGeo, iceMat);
        const angle = (i / 3) * Math.PI * 2; const r = 3.8;
        mesh.position.set(Math.cos(angle) * r, 0, Math.sin(angle) * r);
        mesh.add(new THREE.LineSegments(new THREE.EdgesGeometry(satGeo), new THREE.LineBasicMaterial({ color: 0x00d9ff, opacity: 0.3 })));
        satellites.add(mesh);
    }
    satellites.rotation.z = Math.PI / 6; satellites.rotation.x = Math.PI / 6;
    scene.add(container);
    return container;
}

export function updateShapes(shapes, physics, isServicesPage, isDesktop = true) {
    if (isServicesPage) {
        // Hide all shapes on services page
        shapes.forEach(s => { if (s && s.visible) s.visible = false; });
        return;
    }

    shapes.forEach((shape, index) => {
        if (!shape) return;
        if (!shape.visible) shape.visible = true;

        const isActive = index === physics.activeSection;
        const relIndex = index - physics.activeSection;
        let gx = isDesktop ? 4 : 0, gy = isDesktop ? 0 : 1.5, gz = 0, gs = 1;

        if (index === 3 && isDesktop) gx = -4;

        if (isActive) {
            if (index === 0) { gx = 0; gy = 0; gs = 1.2; }
            else if (index === 2 || index === 5) { gs = 0; }
        } else {
            gy = relIndex * -15; gz = -20; gs = 0;
        }

        shape.position.x += (gx - shape.position.x) * 0.08;
        shape.position.y += (gy - shape.position.y) * 0.08;
        shape.position.z += (gz - shape.position.z) * 0.08;
        const cs = shape.scale.x;
        shape.scale.set(cs + (gs - cs) * 0.08, cs + (gs - cs) * 0.08, cs + (gs - cs) * 0.08);
        shape.rotation.y += 0.002 + (physics.velocity * 0.001);
        shape.rotation.x += 0.001;

        if (shape.userData.parts) shape.userData.parts.rotation.y -= 0.005;
        if (shape.userData.isValueSystem) {
            shape.userData.satellites.rotation.y += 0.01;
            shape.userData.satellites.children.forEach(sat => { sat.rotation.x += 0.02; sat.rotation.z += 0.02; });
        }
    });
}
