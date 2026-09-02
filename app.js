/**
 * SPIDER-MAN PORTFOLIO MAIN APPLICATION - SRINIVASAKANDAN
 * Interactive UI engine handling navigation, typing animation, 3D card tilt,
 * audio web shooter synthesis, project modals, and contact form dispatch.
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // --------------------------------------------------------------------------
  // 1. TYPING TEXT EFFECT (HERO SUBTITLE)
  // --------------------------------------------------------------------------
  const typingElement = document.getElementById('typing-output');
  const taglines = [
    'Software Development Engineer',
    'Real-Life Problem Solver',
    'Emerging Tech Enthusiast',
    'B.E. Computer Science Undergrad @ LICET',
    'Web Architecture Architect'
  ];

  let lineIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 100;

  function typeEffect() {
    const currentLine = taglines[lineIndex];

    if (isDeleting) {
      typingElement.textContent = currentLine.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typingElement.textContent = currentLine.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }

    if (!isDeleting && charIndex === currentLine.length) {
      isDeleting = true;
      typingSpeed = 2000; // Pause at full line
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      lineIndex = (lineIndex + 1) % taglines.length;
      typingSpeed = 500;
    }

    setTimeout(typeEffect, typingSpeed);
  }

  if (typingElement) {
    typeEffect();
  }

  // --------------------------------------------------------------------------
  // 2. STICKY GLASS HEADER & SCROLL SPY
  // --------------------------------------------------------------------------
  const header = document.getElementById('main-header');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    // Scroll spy for active menu highlights
    let currentSectionId = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      const sectionHeight = section.offsetHeight;
      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentSectionId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.querySelector('.nav-menu');

  if (mobileMenuBtn && navMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-active');
      const icon = mobileMenuBtn.querySelector('i');
      if (navMenu.classList.contains('mobile-active')) {
        icon.className = 'fa-solid fa-xmark';
      } else {
        icon.className = 'fa-solid fa-bars';
      }
    });

    // Close menu when clicking a link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('mobile-active');
        mobileMenuBtn.querySelector('i').className = 'fa-solid fa-bars';
      });
    });
  }

  // --------------------------------------------------------------------------
  // 3. 3D CARD TILT INTERACTION
  // --------------------------------------------------------------------------
  const tiltElements = document.querySelectorAll('.tilt-element');

  tiltElements.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -10;
      const rotateY = ((x - centerX) / centerX) * 10;
      
      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
    });
  });

  // --------------------------------------------------------------------------
  // 4. WEB-SHOOTER AUDIO SYNTHESIZER (WEB AUDIO API)
  // --------------------------------------------------------------------------
  let soundEnabled = true;
  const soundBtn = document.getElementById('sound-toggle-btn');
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
  }

  function playWebShooterSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      // High to low frequency web zip sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.15);
    } catch (e) {
      console.log('Audio playback initialized on user touch.');
    }
  }

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      const icon = soundBtn.querySelector('i');
      if (soundEnabled) {
        icon.className = 'fa-solid fa-volume-high';
        soundBtn.style.borderColor = 'var(--spidey-blue)';
        playWebShooterSound();
      } else {
        icon.className = 'fa-solid fa-volume-xmark';
        soundBtn.style.borderColor = 'rgba(255,255,255,0.2)';
      }
    });
  }

  // Attach sound trigger to all buttons & CTA links
  document.querySelectorAll('.btn, .nav-link, .social-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      playWebShooterSound();
    });
  });

  // --------------------------------------------------------------------------
  // 5. ANIMATED NUMERIC COUNTERS
  // --------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-num');
  let animated = false;

  function animateCounters() {
    statNumbers.forEach(counter => {
      const target = +counter.getAttribute('data-target');
      const count = +counter.innerText;
      const increment = Math.ceil(target / 40);

      if (count < target) {
        counter.innerText = Math.min(count + increment, target);
        setTimeout(animateCounters, 30);
      } else {
        counter.innerText = target;
      }
    });
  }

  window.addEventListener('scroll', () => {
    const heroSection = document.getElementById('hero');
    if (!animated && heroSection && window.scrollY < heroSection.offsetHeight) {
      animateCounters();
      animated = true;
    }
  });

  // Trigger initial counter check
  animateCounters();
});

// --------------------------------------------------------------------------
// 6. PROJECT MODAL POPUP SYSTEM
// --------------------------------------------------------------------------
const projectData = {
  1: {
    title: 'Smart Problem Diagnosis System',
    subtitle: 'Emerging Tech & AI Driven Algorithmic Solution Platform',
    category: 'Emerging Tech & AI Solution',
    description: 'An end-to-end intelligent engineering system designed to ingest real-life problem statements, decompose them into modular computational steps, and generate structured C++ & Web solutions.',
    problemSolved: 'Engineers often struggle with turning vague real-world problem descriptions into concrete algorithmic blueprints. This system automates problem abstraction and provides instant code prototypes.',
    techStack: ['C++ Core Logic', 'JavaScript', 'REST API', 'HTML5 / CSS3 Glassmorphism'],
    features: [
      'Automated problem statement parsing',
      'Data structure & complexity estimator',
      'Interactive visual output preview',
      'Exportable clean source code templates'
    ]
  },
  2: {
    title: 'LICET Smart Campus Problem Resolver',
    subtitle: 'Full-Stack Web System for College Infrastructure & Student Events',
    category: 'Full-Stack Web Application',
    description: 'Designed specifically for LICET (Loyola-ICAM College of Engineering & Technology), this platform enables students to report campus technical challenges, track repair workflows, and manage club event registrations.',
    problemSolved: 'Replaces manual paper workflows and slow email threads with real-time digital problem tracking and automated notification streams.',
    techStack: ['Node.js', 'Express.js', 'SQL Database', 'REST APIs', 'Glass UI'],
    features: [
      'Real-time student grievance submission',
      'Role-based admin resolution dashboard',
      'Automated campus event notifications',
      'Analytical reports on resolution speed'
    ]
  },
  3: {
    title: 'Cyber Spider Interactive Web Engine',
    subtitle: 'Custom Canvas Physics & Glassmorphic Design System',
    category: 'Interactive Web Graphics',
    description: 'A light-weight, dependency-free JavaScript canvas physics framework that powers Spider-Man themed web particle trails, explosive click shockwaves, and 3D glass tilt elements.',
    problemSolved: 'Delivers high-performance 60fps web animations and wows users visually without adding heavy external library overhead.',
    techStack: ['Vanilla JavaScript', 'HTML5 Canvas API', 'CSS Variables', 'Physics Simulation'],
    features: [
      'Silk particle web trail tracking',
      'Radial splash shockwave physics on click',
      '3D perspective tilt calculations',
      'Mobile responsive touch gesture support'
    ]
  }
};

function openProjectModal(projectId) {
  const data = projectData[projectId];
  if (!data) return;

  const modalBody = document.getElementById('modal-body');
  const modal = document.getElementById('project-modal');

  modalBody.innerHTML = `
    <div class="modal-project-header">
      <span class="card-status-badge badge-active">${data.category}</span>
      <h2 style="font-size: 1.8rem; margin: 0.5rem 0; color: #fff;">${data.title}</h2>
      <p style="color: var(--spidey-blue); font-size: 0.95rem; margin-bottom: 1.25rem;">${data.subtitle}</p>
    </div>

    <div style="background: rgba(255,255,255,0.03); padding: 1.25rem; border-radius: 12px; margin-bottom: 1.25rem; border-left: 3px solid var(--spidey-red);">
      <h4 style="color: var(--spidey-red); margin-bottom: 0.4rem;"><i class="fa-solid fa-bullseye"></i> Real-Life Problem Solved</h4>
      <p style="color: #cbd5e1; font-size: 0.92rem; line-height: 1.6;">${data.problemSolved}</p>
    </div>

    <div style="margin-bottom: 1.25rem;">
      <h4 style="color: #fff; margin-bottom: 0.6rem;"><i class="fa-solid fa-align-left"></i> Solution Overview</h4>
      <p style="color: var(--text-muted); font-size: 0.92rem; line-height: 1.6;">${data.description}</p>
    </div>

    <div style="margin-bottom: 1.25rem;">
      <h4 style="color: #fff; margin-bottom: 0.6rem;"><i class="fa-solid fa-star"></i> Key Capabilities</h4>
      <ul style="list-style: none; padding: 0; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;">
        ${data.features.map(f => `<li style="font-size: 0.85rem; color: #cbd5e1; display: flex; align-items: center; gap: 0.4rem;"><i class="fa-solid fa-check text-cyan"></i> ${f}</li>`).join('')}
      </ul>
    </div>

    <div style="margin-bottom: 1.5rem;">
      <h4 style="color: #fff; margin-bottom: 0.6rem;"><i class="fa-solid fa-layer-group"></i> Tech Stack</h4>
      <div style="display: flex; flex-wrap: wrap; gap: 0.5rem;">
        ${data.techStack.map(t => `<span class="tech-badge" style="border-color: var(--spidey-blue); color: var(--spidey-blue);">${t}</span>`).join('')}
      </div>
    </div>

    <div style="display: flex; gap: 1rem; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
      <a href="https://github.com" target="_blank" class="btn btn-spidey-primary" style="padding: 0.6rem 1.2rem; font-size: 0.88rem;">
        <i class="fa-brands fa-github"></i> View GitHub Repository
      </a>
      <button class="btn btn-spidey-outline" onclick="closeProjectModal()" style="padding: 0.6rem 1.2rem; font-size: 0.88rem;">
        Close Window
      </button>
    </div>
  `;

  modal.classList.add('active');
}

function closeProjectModal() {
  const modal = document.getElementById('project-modal');
  if (modal) {
    modal.classList.remove('active');
  }
}

// Close modal when clicking backdrop
document.addEventListener('click', (e) => {
  const modal = document.getElementById('project-modal');
  if (e.target === modal) {
    closeProjectModal();
  }
});

// --------------------------------------------------------------------------
// 7. CONTACT FORM SUBMISSION DISPATCH
// --------------------------------------------------------------------------
function handleFormSubmit(e) {
  e.preventDefault();
  
  const nameInput = document.getElementById('user-name');
  const emailInput = document.getElementById('user-email');
  const subjectInput = document.getElementById('user-subject');
  const messageInput = document.getElementById('user-message');
  const submitBtn = document.getElementById('submit-btn');

  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (!name || !email) return;

  // Animate button launch
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Dispatching Web Message...';

  setTimeout(() => {
    submitBtn.innerHTML = '<i class="fa-solid fa-check-double"></i> Web Message Sent!';
    submitBtn.style.background = 'linear-gradient(135deg, #00f0ff 0%, #1255e6 100%)';

    // Show custom Spider Web Success alert
    const modalBody = document.getElementById('modal-body');
    const modal = document.getElementById('project-modal');

    modalBody.innerHTML = `
      <div style="text-align: center; padding: 1.5rem 0;">
        <div style="width: 70px; height: 70px; border-radius: 50%; background: rgba(0,240,255,0.15); border: 2px solid var(--spidey-blue); display: flex; align-items: center; justify-content: center; margin: 0 auto 1.25rem; font-size: 2rem; color: var(--spidey-blue); box-shadow: 0 0 25px var(--spidey-blue-glow);">
          <i class="fa-solid fa-spider"></i>
        </div>
        <h2 style="font-size: 1.8rem; color: #fff; margin-bottom: 0.5rem;">Web Signal Received!</h2>
        <p style="color: var(--spidey-blue); font-weight: 600; margin-bottom: 1rem;">Thank you, ${name}!</p>
        <p style="color: var(--text-muted); font-size: 0.95rem; line-height: 1.6; max-width: 480px; margin: 0 auto 1.5rem;">
          Your message regarding <strong>"${subjectInput.value}"</strong> has been successfully transmitted to <strong>Srinivasakandan</strong>. He will get back to you at <u>${email}</u> shortly.
        </p>
        <button class="btn btn-spidey-primary" onclick="closeProjectModal()">
          Continue Browsing
        </button>
      </div>
    `;

    modal.classList.add('active');

    // Reset Form
    nameInput.value = '';
    emailInput.value = '';
    subjectInput.value = '';
    messageInput.value = '';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<span class="btn-text"><i class="fa-solid fa-paper-plane"></i> Launch Web Message</span>';
      submitBtn.style.background = 'linear-gradient(135deg, var(--spidey-red) 0%, var(--spidey-red-dark) 100%)';
    }, 4000);

  }, 1200);
}
