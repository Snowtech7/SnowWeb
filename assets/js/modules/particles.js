export function initParticles(canvasBg) {
    if (!canvasBg) return [];
    canvasBg.width = window.innerWidth;
    canvasBg.height = window.innerHeight;
    const particles = [];
    for (let i = 0; i < 200; i++) {
        particles.push({
            x: Math.random() * canvasBg.width,
            y: Math.random() * canvasBg.height,
            z: Math.random() * 2 + 0.5,
            size: Math.random() * 2,
            speed: Math.random() * 0.5 + 0.1,
            baseAlpha: Math.random() * 0.5 + 0.2
        });
    }
    return particles;
}

export function updateParticles(ctx, particles, physics, canvasBg) {
    if (!ctx || !canvasBg) return;

    ctx.clearRect(0, 0, canvasBg.width, canvasBg.height);
    ctx.fillStyle = "#ffffff";

    particles.forEach(p => {
        const move = physics.velocity * p.z * 0.1;
        p.y += move;
        if (p.y > canvasBg.height) p.y -= canvasBg.height;
        if (p.y < 0) p.y += canvasBg.height;

        ctx.beginPath();
        const stretch = Math.abs(physics.velocity * 0.5);
        if (stretch > 2) {
            ctx.moveTo(p.x, p.y);
            const dir = physics.velocity > 0 ? -1 : 1;
            ctx.lineTo(p.x, p.y + (stretch * dir * 2));
            ctx.strokeStyle = `rgba(255, 255, 255, ${p.baseAlpha * 0.5})`;
            ctx.lineWidth = p.size;
            ctx.stroke();
        } else {
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 255, 255, ${p.baseAlpha})`;
            ctx.fill();
        }
    });
}
