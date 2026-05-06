// ===================== THREE.JS 3D BACKGROUND =====================
(function initThreeBackground() {
  const canvas = document.getElementById('bg-canvas');
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  camera.position.z = 30;

  // Particle system
  const particleCount = 800;
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);
  const c1 = new THREE.Color(0x8B5CF6);
  const c2 = new THREE.Color(0x06B6D4);

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 80;
    const mix = Math.random();
    const c = c1.clone().lerp(c2, mix);
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
    sizes[i] = Math.random() * 2 + 0.5;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({ size: 0.15, vertexColors: true, transparent: true, opacity: 0.6, sizeAttenuation: true });
  const particles = new THREE.Points(geo, mat);
  scene.add(particles);

  // Wireframe shapes
  const torusGeo = new THREE.TorusKnotGeometry(5, 1.5, 100, 16);
  const wireframeMat = new THREE.MeshBasicMaterial({ color: 0x8B5CF6, wireframe: true, transparent: true, opacity: 0.08 });
  const torusKnot = new THREE.Mesh(torusGeo, wireframeMat);
  torusKnot.position.set(15, -5, -10);
  scene.add(torusKnot);

  const icoGeo = new THREE.IcosahedronGeometry(4, 1);
  const icoMat = new THREE.MeshBasicMaterial({ color: 0x06B6D4, wireframe: true, transparent: true, opacity: 0.06 });
  const ico = new THREE.Mesh(icoGeo, icoMat);
  ico.position.set(-15, 8, -5);
  scene.add(ico);

  const octGeo = new THREE.OctahedronGeometry(3, 0);
  const octMat = new THREE.MeshBasicMaterial({ color: 0xF43F5E, wireframe: true, transparent: true, opacity: 0.07 });
  const oct = new THREE.Mesh(octGeo, octMat);
  oct.position.set(-10, -12, -8);
  scene.add(oct);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate() {
    requestAnimationFrame(animate);
    const t = Date.now() * 0.0005;
    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;
    torusKnot.rotation.x = t * 0.5; torusKnot.rotation.y = t * 0.3;
    ico.rotation.x = -t * 0.4; ico.rotation.z = t * 0.2;
    oct.rotation.y = t * 0.6; oct.rotation.z = -t * 0.3;
    camera.position.x += (mouseX * 2 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);
    renderer.render(scene, camera);
  }
  animate();
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();

// ===================== CUSTOM CURSOR =====================
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursor-follower');
let cursorX = 0, cursorY = 0, followerX = 0, followerY = 0;

document.addEventListener('mousemove', (e) => {
  cursorX = e.clientX; cursorY = e.clientY;
});
function animateCursor() {
  followerX += (cursorX - followerX) * 0.12;
  followerY += (cursorY - followerY) * 0.12;
  if (cursor) cursor.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
  if (follower) follower.style.transform = `translate(${followerX}px, ${followerY}px) translate(-50%, -50%)`;
  requestAnimationFrame(animateCursor);
}
animateCursor();

document.querySelectorAll('a, button, .skill-card, .work-card').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width = '40px'; cursor.style.height = '40px'; cursor.style.background = 'rgba(139,92,246,0.15)';
    follower.style.width = '60px'; follower.style.height = '60px'; follower.style.borderColor = 'rgba(139,92,246,0.8)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width = '8px'; cursor.style.height = '8px'; cursor.style.background = '#8B5CF6';
    follower.style.width = '36px'; follower.style.height = '36px'; follower.style.borderColor = 'rgba(139,92,246,0.5)';
  });
});

// ===================== PRELOADER =====================
window.addEventListener('load', () => {
  const fill = document.getElementById('preloader-bar-fill');
  const preloader = document.getElementById('preloader');
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 15 + 5;
    if (progress >= 100) { progress = 100; clearInterval(interval); }
    fill.style.width = progress + '%';
    if (progress >= 100) {
      setTimeout(() => {
        gsap.to(preloader, { opacity: 0, duration: 0.6, onComplete: () => {
          preloader.style.display = 'none';
          initGSAP();
        }});
      }, 400);
    }
  }, 100);
});

// ===================== MOBILE MENU =====================
const menuBtn = document.getElementById('nav-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
menuBtn.addEventListener('click', () => {
  menuBtn.classList.toggle('active');
  mobileMenu.classList.toggle('active');
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    menuBtn.classList.remove('active');
    mobileMenu.classList.remove('active');
  });
});

// ===================== CONTACT FORM =====================
document.getElementById('contact-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = document.getElementById('form-submit');
  btn.innerHTML = '<span class="submit-text">Sent! ✓</span>';
  btn.style.background = 'linear-gradient(135deg, #10B981, #06B6D4)';
  setTimeout(() => {
    btn.innerHTML = '<span class="submit-text">Send Message</span><span class="submit-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 2L11 13"/><path d="M22 2L15 22L11 13L2 9L22 2Z"/></svg></span>';
    btn.style.background = '';
    e.target.reset();
  }, 2500);
});

// ===================== GSAP ANIMATIONS =====================
function initGSAP() {
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // Nav entrance
  gsap.to('.nav', { y: 0, duration: 0.8, ease: 'power3.out', delay: 0.2 });

  // Hero animations
  const heroTL = gsap.timeline({ defaults: { ease: 'power4.out' } });
  heroTL
    .from('.hero-badge', { y: 30, opacity: 0, duration: 0.8 })
    .from('.title-word', { y: 120, opacity: 0, rotationX: -90, duration: 1, stagger: 0.15, transformOrigin: 'bottom center' }, '-=0.4')
    .from('.subtitle-line span', { y: 20, opacity: 0, duration: 0.6, stagger: 0.1 }, '-=0.5')
    .from('.cta-button', { y: 30, opacity: 0, scale: 0.9, duration: 0.6, stagger: 0.12 }, '-=0.3')
    .from('.hero-scroll-indicator', { opacity: 0, y: 20, duration: 0.6 }, '-=0.2');

  // Nav link smooth scroll
  document.querySelectorAll('.nav-link, .mobile-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 80 }, ease: 'power3.inOut' });
    });
  });
  document.querySelectorAll('.cta-button').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = link.getAttribute('href');
      gsap.to(window, { duration: 1, scrollTo: { y: target, offsetY: 80 }, ease: 'power3.inOut' });
    });
  });

  // Section headers
  gsap.utils.toArray('.section-header').forEach(header => {
    gsap.from(header.querySelector('.section-number'), {
      scrollTrigger: { trigger: header, start: 'top 80%', toggleActions: 'play none none reverse' },
      x: -30, opacity: 0, duration: 0.6
    });
    gsap.from(header.querySelector('.title-reveal'), {
      scrollTrigger: { trigger: header, start: 'top 80%', toggleActions: 'play none none reverse' },
      y: 60, opacity: 0, rotationX: -45, duration: 0.8, transformOrigin: 'bottom'
    });
    gsap.from(header.querySelector('.section-line'), {
      scrollTrigger: { trigger: header, start: 'top 80%', toggleActions: 'play none none reverse' },
      scaleX: 0, transformOrigin: 'left', duration: 0.8, delay: 0.3
    });
  });

  // About section 3D reveal
  gsap.from('.about-image-frame', {
    scrollTrigger: { trigger: '.about', start: 'top 70%', toggleActions: 'play none none reverse' },
    scale: 0.8, rotationY: -30, opacity: 0, duration: 1, ease: 'power3.out'
  });
  gsap.from('.about-text', {
    scrollTrigger: { trigger: '.about-content', start: 'top 75%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.7, stagger: 0.15
  });
  gsap.from('.about-tags .tag', {
    scrollTrigger: { trigger: '.about-tags', start: 'top 85%', toggleActions: 'play none none reverse' },
    scale: 0, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(2)'
  });

  // Stats counter
  gsap.utils.toArray('.stat-number').forEach(stat => {
    const target = parseInt(stat.dataset.count);
    gsap.fromTo(stat, { innerText: 0 }, {
      innerText: target, duration: 2, ease: 'power2.out', snap: { innerText: 1 },
      scrollTrigger: { trigger: stat, start: 'top 85%', toggleActions: 'play none none reverse' }
    });
  });
  gsap.from('.stat-item', {
    scrollTrigger: { trigger: '.about-stats', start: 'top 85%', toggleActions: 'play none none reverse' },
    y: 30, opacity: 0, duration: 0.5, stagger: 0.1
  });

  // Skill cards 3D flip entrance
  gsap.utils.toArray('.skill-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 60, opacity: 0, rotationX: -15, scale: 0.95, duration: 0.7, delay: i * 0.08, ease: 'power3.out'
    });
  });

  // Progress bars
  gsap.utils.toArray('.progress-bar').forEach(bar => {
    gsap.to(bar, {
      width: bar.dataset.progress + '%',
      scrollTrigger: { trigger: bar, start: 'top 90%', toggleActions: 'play none none reverse' },
      duration: 1.5, ease: 'power3.out'
    });
  });

  // Skill card 3D tilt
  document.querySelectorAll('.skill-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left; const y = e.clientY - rect.top;
      const centerX = rect.width / 2; const centerY = rect.height / 2;
      const rotateX = (y - centerY) / centerY * -8;
      const rotateY = (x - centerX) / centerX * 8;
      gsap.to(card, { rotationX: rotateX, rotationY: rotateY, transformPerspective: 500, duration: 0.3, ease: 'power2.out' });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  // Timeline items
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: { trigger: item, start: 'top 85%', toggleActions: 'play none none reverse' },
      x: -60, opacity: 0, duration: 0.7, delay: i * 0.1, ease: 'power3.out'
    });
  });
  gsap.from('.timeline-line', {
    scrollTrigger: { trigger: '.timeline', start: 'top 80%', end: 'bottom 20%', scrub: 1 },
    scaleY: 0, transformOrigin: 'top'
  });

  // Work cards 3D parallax
  gsap.utils.toArray('.work-card').forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
      y: 80, opacity: 0, rotationY: i % 2 === 0 ? -15 : 15, scale: 0.9, duration: 0.9, ease: 'power3.out'
    });
    // Parallax on work card visual
    gsap.to(card.querySelector('.work-card-visual'), {
      scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 1 },
      y: -30
    });
  });

  // Work card 3D tilt
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(card, { rotationY: x * 10, rotationX: -y * 10, transformPerspective: 600, duration: 0.3 });
    });
    card.addEventListener('mouseleave', () => {
      gsap.to(card, { rotationY: 0, rotationX: 0, duration: 0.5, ease: 'power2.out' });
    });
  });

  // Contact section
  gsap.from('.contact-intro', {
    scrollTrigger: { trigger: '.contact', start: 'top 75%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.7
  });
  gsap.from('.contact-info-item', {
    scrollTrigger: { trigger: '.contact-info-list', start: 'top 85%', toggleActions: 'play none none reverse' },
    x: -30, opacity: 0, duration: 0.5, stagger: 0.1
  });
  gsap.from('.social-link', {
    scrollTrigger: { trigger: '.social-links', start: 'top 90%', toggleActions: 'play none none reverse' },
    scale: 0, opacity: 0, duration: 0.4, stagger: 0.08, ease: 'back.out(2)'
  });
  gsap.from('.form-group', {
    scrollTrigger: { trigger: '.contact-form', start: 'top 80%', toggleActions: 'play none none reverse' },
    y: 40, opacity: 0, duration: 0.6, stagger: 0.12
  });
  gsap.from('.form-submit', {
    scrollTrigger: { trigger: '.form-submit', start: 'top 90%', toggleActions: 'play none none reverse' },
    y: 20, opacity: 0, scale: 0.9, duration: 0.5
  });

  // Parallax floating shapes in hero
  gsap.to('.shape-1', { scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }, y: -100, x: 50 });
  gsap.to('.shape-2', { scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }, y: -80, x: -40 });
  gsap.to('.shape-3', { scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 1 }, y: -120 });

  // Nav background on scroll
  ScrollTrigger.create({
    start: 100,
    onEnter: () => gsap.to('.nav', { background: 'rgba(10,10,15,0.85)', borderBottomColor: 'rgba(139,92,246,0.1)', duration: 0.3 }),
    onLeaveBack: () => gsap.to('.nav', { background: 'rgba(10,10,15,0.6)', borderBottomColor: 'rgba(139,92,246,0.05)', duration: 0.3 })
  });
}
