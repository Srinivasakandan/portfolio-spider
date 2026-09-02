/**
 * SPIDER-MAN REALISTIC WEB CURSOR ENGINE
 * Author: Antigravity AI for Srinivasakandan Portfolio
 * 
 * Features:
 * 1. Geometric Spider Web Shooter trail following cursor movement.
 * 2. Full 8-spoke radial Spider Web shockwave blast on mouse click/touch ("THWIP!").
 * 3. Magnetic web silk connection strands anchored to hovered buttons/links.
 * 4. Glowing Web Reticle follower.
 */

(function () {
  'use strict';

  const canvas = document.getElementById('splash-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Pointer position & history
  const mouse = {
    x: width / 2,
    y: height / 2,
    lx: width / 2,
    ly: height / 2,
    targetX: width / 2,
    targetY: width / 2
  };

  const trail = [];
  const webShooterBlasts = [];
  const hoveredElements = [];

  // Colors
  const SPIDEY_RED = '#ff2a4b';
  const SPIDEY_BLUE = '#00f0ff';
  const SILK_WHITE = '#ffffff';

  // Track Mouse Movement
  window.addEventListener('mousemove', (e) => {
    mouse.lx = mouse.x;
    mouse.ly = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    // Add trail node
    trail.push({
      x: mouse.x,
      y: mouse.y,
      life: 1.0,
      size: Math.random() * 3 + 2
    });

    if (trail.length > 25) {
      trail.shift();
    }
  });

  // Track Touch Movement
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      mouse.x = t.clientX;
      mouse.y = t.clientY;

      trail.push({
        x: mouse.x,
        y: mouse.y,
        life: 1.0,
        size: 3
      });
      if (trail.length > 25) trail.shift();
    }
  }, { passive: true });

  // Web Shooter Blast on Click ("THWIP!")
  function spawnWebBlast(x, y) {
    webShooterBlasts.push({
      x: x,
      y: y,
      radius: 5,
      maxRadius: Math.random() * 50 + 60,
      spokes: 8,
      rings: 4,
      life: 1.0,
      decay: 0.025,
      angleOffset: Math.random() * Math.PI
    });
  }

  window.addEventListener('mousedown', (e) => {
    spawnWebBlast(e.clientX, e.clientY);
  });

  window.addEventListener('touchstart', (e) => {
    if (e.touches.length > 0) {
      spawnWebBlast(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // Find nearby interactive buttons/cards to attach magnetic web threads
  setInterval(() => {
    const interactiveEls = document.querySelectorAll('button, a, .glass-panel, .tech-badge');
    hoveredElements.length = 0;

    interactiveEls.forEach((el) => {
      const rect = el.getBoundingClientRect();
      if (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= window.innerHeight &&
        rect.right <= window.innerWidth
      ) {
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dist = Math.hypot(mouse.x - centerX, mouse.y - centerY);

        if (dist < 180) {
          hoveredElements.push({
            x: centerX,
            y: centerY,
            cornerX: rect.left,
            cornerY: rect.top,
            dist: dist
          });
        }
      }
    });
  }, 100);

  // Draw Spider Web Graphic (Spokes + Concentric Rings)
  function drawSpiderWeb(x, y, radius, spokes, rings, alpha, angleOffset) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = SPIDEY_RED;
    ctx.lineWidth = 1;
    ctx.shadowBlur = 8;
    ctx.shadowColor = SPIDEY_RED;

    // 1. Draw Radial Spokes
    const angleStep = (Math.PI * 2) / spokes;
    const spokePoints = [];

    for (let i = 0; i < spokes; i++) {
      const angle = i * angleStep + angleOffset;
      const endX = x + Math.cos(angle) * radius;
      const endY = y + Math.sin(angle) * radius;

      spokePoints.push({ x: endX, y: endY, angle: angle });

      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // 2. Draw Concentric Web Rings (Curved silk connections)
    ctx.strokeStyle = SPIDEY_BLUE;
    ctx.lineWidth = 0.8;
    ctx.shadowColor = SPIDEY_BLUE;

    for (let r = 1; r <= rings; r++) {
      const ringRadius = (radius / rings) * r;
      ctx.beginPath();

      for (let i = 0; i < spokes; i++) {
        const angle1 = i * angleStep + angleOffset;
        const angle2 = ((i + 1) % spokes) * angleStep + angleOffset;

        const p1x = x + Math.cos(angle1) * ringRadius;
        const p1y = y + Math.sin(angle1) * ringRadius;
        const p2x = x + Math.cos(angle2) * ringRadius;
        const p2y = y + Math.sin(angle2) * ringRadius;

        // Curve slightly inward to look like realistic woven web silk
        const midAngle = (angle1 + angle2) / 2;
        const ctrlDist = ringRadius * 0.85;
        const ctrlX = x + Math.cos(midAngle) * ctrlDist;
        const ctrlY = y + Math.sin(midAngle) * ctrlDist;

        if (i === 0) {
          ctx.moveTo(p1x, p1y);
        }
        ctx.quadraticCurveTo(ctrlX, ctrlY, p2x, p2y);
      }
      ctx.stroke();
    }

    // 3. Center Web Core Glow
    ctx.fillStyle = SILK_WHITE;
    ctx.beginPath();
    ctx.arc(x, y, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  // Animation Loop
  function animate() {
    ctx.clearRect(0, 0, width, height);

    // A. Draw Magnetic Web Threads from Cursor to Nearby Interactive Cards/Buttons
    hoveredElements.forEach((target) => {
      const alpha = (1 - target.dist / 180) * 0.7;
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.strokeStyle = SPIDEY_BLUE;
      ctx.lineWidth = 1;
      ctx.shadowBlur = 10;
      ctx.shadowColor = SPIDEY_BLUE;

      ctx.beginPath();
      ctx.moveTo(mouse.x, mouse.y);
      ctx.lineTo(target.x, target.y);
      ctx.stroke();

      // Small web node anchor at target
      ctx.fillStyle = SPIDEY_RED;
      ctx.beginPath();
      ctx.arc(target.x, target.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    // B. Draw Web Trail (Spider silk connecting cursor motion history)
    if (trail.length > 1) {
      ctx.save();
      for (let i = 0; i < trail.length; i++) {
        const p = trail[i];
        p.life -= 0.025;

        if (p.life > 0) {
          // Fade node
          ctx.globalAlpha = p.life * 0.8;
          ctx.fillStyle = i % 2 === 0 ? SPIDEY_RED : SPIDEY_BLUE;
          ctx.shadowBlur = 8;
          ctx.shadowColor = ctx.fillStyle;

          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
          ctx.fill();

          // Connect silk lines between adjacent trail nodes
          if (i > 0) {
            const prev = trail[i - 1];
            ctx.strokeStyle = SILK_WHITE;
            ctx.lineWidth = p.life * 1.5;
            ctx.beginPath();
            ctx.moveTo(prev.x, prev.y);
            ctx.lineTo(p.x, p.y);
            ctx.stroke();
          }

          // Draw cross web lines between nearby nodes in trail
          if (i > 3) {
            const pOld = trail[i - 3];
            const dist = Math.hypot(p.x - pOld.x, p.y - pOld.y);
            if (dist < 80) {
              ctx.strokeStyle = SPIDEY_RED;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(pOld.x, pOld.y);
              ctx.stroke();
            }
          }
        }
      }
      ctx.restore();

      // Filter out dead trail nodes
      for (let i = trail.length - 1; i >= 0; i--) {
        if (trail[i].life <= 0) trail.splice(i, 1);
      }
    }

    // C. Draw Expanding Web Shooter Blasts ("THWIP!")
    for (let i = webShooterBlasts.length - 1; i >= 0; i--) {
      const blast = webShooterBlasts[i];
      blast.radius += (blast.maxRadius - blast.radius) * 0.15;
      blast.life -= blast.decay;

      if (blast.life > 0) {
        drawSpiderWeb(
          blast.x,
          blast.y,
          blast.radius,
          blast.spokes,
          blast.rings,
          blast.life,
          blast.angleOffset
        );
      } else {
        webShooterBlasts.splice(i, 1);
      }
    }

    // D. Draw Active Web Reticle at Current Mouse Position
    drawSpiderWeb(mouse.x, mouse.y, 22, 6, 2, 0.85, 0);

    requestAnimationFrame(animate);
  }

  animate();
})();
