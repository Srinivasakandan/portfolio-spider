/**
 * SPIDER-MAN CANVAS SPLASH CURSOR ENGINE
 * High Performance Web Particle & Splash Physics Engine
 * Author: Antigravity AI for Srinivasakandan Portfolio
 */

(function () {
  'use strict';

  const canvas = document.getElementById('splash-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  // Particle System Storage
  const particles = [];
  const webStrands = [];
  
  // Mouse position state
  let mouse = {
    x: width / 2,
    y: height / 2,
    lx: width / 2,
    ly: height / 2,
    isMoving: false,
    down: false
  };

  // Color options: Spider-Man Signature Red & Cyan Blue
  const colorPalette = [
    '#ff2a4b', // Web Red
    '#00f0ff', // Cyber Blue
    '#ffffff', // Pure Silk White
    '#e60026', // Crimson Red
    '#1d4ed8'  # Deep Navy Blue
  ];

  function getRandomColor() {
    return colorPalette[Math.floor(Math.random() * colorPalette.length)];
  }

  // Handle Resize
  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  // Particle Constructor
  class Particle {
    constructor(x, y, vx, vy, color, size, life) {
      this.x = x;
      this.y = y;
      this.vx = vx;
      this.vy = vy;
      this.color = color;
      this.size = size;
      this.maxLife = life || 40;
      this.life = this.maxLife;
      this.decay = 0.94;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= this.decay;
      this.vy *= this.decay;
      this.life--;
    }

    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Silk Web Line Constructor
  class WebStrand {
    constructor(x1, y1, x2, y2, color) {
      this.x1 = x1;
      this.y1 = y1;
      this.x2 = x2;
      this.y2 = y2;
      this.color = color;
      this.life = 25;
      this.maxLife = 25;
    }

    update() {
      this.life--;
    }

    draw(ctx) {
      const alpha = Math.max(0, this.life / this.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha * 0.7;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = alpha * 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.moveTo(this.x1, this.y1);
      ctx.lineTo(this.x2, this.y2);
      ctx.stroke();
      ctx.restore();
    }
  }

  // Create Splash Effect at (x, y)
  function createSplash(x, y, count = 25) {
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 / count) * i + (Math.random() - 0.5);
      const speed = Math.random() * 8 + 3;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;
      const color = getRandomColor();
      const size = Math.random() * 3.5 + 1.5;
      particles.push(new Particle(x, y, vx, vy, color, size, Math.random() * 30 + 20));
      
      // Connect radial silk strands
      if (i % 3 === 0) {
        webStrands.push(new WebStrand(x, y, x + vx * 6, y + vy * 6, color));
      }
    }
  }

  // Track Mouse Pointer
  window.addEventListener('mousemove', (e) => {
    mouse.lx = mouse.x;
    mouse.ly = mouse.y;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    mouse.isMoving = true;

    // Create subtle web trail on movement
    const dx = mouse.x - mouse.lx;
    const dy = mouse.y - mouse.ly;
    const dist = Math.hypot(dx, dy);

    if (dist > 3) {
      const vx = (Math.random() - 0.5) * 2 + dx * 0.15;
      const vy = (Math.random() - 0.5) * 2 + dy * 0.15;
      const color = getRandomColor();
      particles.push(new Particle(mouse.x, mouse.y, vx, vy, color, Math.random() * 2.5 + 1, 30));

      if (Math.random() > 0.5) {
        webStrands.push(new WebStrand(mouse.lx, mouse.ly, mouse.x, mouse.y, color));
      }
    }
  });

  // Track Mouse Click Splash
  window.addEventListener('mousedown', (e) => {
    mouse.down = true;
    createSplash(e.clientX, e.clientY, 35);
  });

  window.addEventListener('mouseup', () => {
    mouse.down = false;
  });

  // Touch Screen Support
  window.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
      const t = e.touches[0];
      mouse.x = t.clientX;
      mouse.y = t.clientY;
      createSplash(t.clientX, t.clientY, 8);
    }
  }, { passive: true });

  // Animation Loop
  function render() {
    ctx.clearRect(0, 0, width, height);

    // Render Web Strands
    for (let i = webStrands.length - 1; i >= 0; i--) {
      const strand = webStrands[i];
      strand.update();
      strand.draw(ctx);
      if (strand.life <= 0) {
        webStrands.splice(i, 1);
      }
    }

    // Render Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.update();
      p.draw(ctx);
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(render);
  }

  // Launch Engine
  render();
})();
