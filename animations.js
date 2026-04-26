// ===== PARTICLE NETWORK BACKGROUND =====
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const PARTICLE_COUNT = 80;
const MAX_DIST = 140;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

class Particle {
  constructor() { this.reset(); }
  reset() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.4;
    this.vy = (Math.random() - 0.5) * 0.4;
    this.r = Math.random() * 2 + 1;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
  draw() {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(108, 99, 255, 0.6)';
    ctx.fill();
  }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
  particles.push(new Particle());
}

function drawLines() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MAX_DIST) {
        const alpha = (1 - dist / MAX_DIST) * 0.3;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(108, 99, 255, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawLines();
  requestAnimationFrame(animate);
}
animate();

// ===== PHYSICS COIN FLIP ON PHOTO =====
const photoWrapper = document.querySelector('.photo-wrapper');
if (photoWrapper) {
  let rotX = 0, rotY = 0;
  let velX = 0, velY = 0;
  let lastMouseX = 0, lastMouseY = 0;
  let dragging = false;

  photoWrapper.style.transition = 'none';

  function animatePhoto() {
    if (!dragging) {
      velX *= 0.95;
      velY *= 0.95;
      rotY += velX;
      rotX += velY;
    }
    photoWrapper.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
    requestAnimationFrame(animatePhoto);
  }
  animatePhoto();

  photoWrapper.addEventListener('mousedown', (e) => {
    dragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    e.preventDefault();
  });

  window.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastMouseX;
    const dy = e.clientY - lastMouseY;
    velX = dx * 0.4;
    velY = dy * 0.4;
    rotY += dx * 0.4;
    rotX += dy * 0.4;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
  });

  window.addEventListener('mouseup', () => {
    dragging = false;
  });
}
const nameEl = document.querySelector('.flame-name');
if (nameEl) {
  nameEl.addEventListener('mousemove', (e) => {
    for (let i = 0; i < 3; i++) spawnFlame(e, nameEl);
  });
}

function spawnFlame(e, el) {
  const rect = el.getBoundingClientRect();
  const x = e.clientX - rect.left + (Math.random() - 0.5) * 40;
  const y = rect.height;

  const particle = document.createElement('span');
  particle.classList.add('flame-particle');

  const size = Math.random() * 12 + 6;
  const duration = Math.random() * 600 + 400;
  const hue = Math.random() * 40; // orange to red range

  particle.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${x}px;
    top: ${y}px;
    background: radial-gradient(circle, hsl(${hue}, 100%, 70%), hsl(${hue}, 100%, 40%));
    animation-duration: ${duration}ms;
    box-shadow: 0 0 ${size}px hsl(${hue}, 100%, 60%);
  `;

  el.appendChild(particle);
  setTimeout(() => particle.remove(), duration);
}