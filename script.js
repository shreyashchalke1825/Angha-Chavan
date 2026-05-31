/* ── script.js ── */

// ── CUSTOM CURSOR ──
const cursor = document.getElementById('cursor');
const follower = document.getElementById('cursorFollower');
let mx = 0, my = 0, fx = 0, fy = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animFollower() {
  fx += (mx - fx) * 0.12;
  fy += (my - fy) * 0.12;
  follower.style.left = fx + 'px';
  follower.style.top  = fy + 'px';
  requestAnimationFrame(animFollower);
})();

document.querySelectorAll('a, button, .pcard, .acard, .stag, .etag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.5)';
    follower.style.transform = 'translate(-50%,-50%) scale(1.6)';
    follower.style.opacity = '0.25';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.transform = 'translate(-50%,-50%) scale(1)';
    follower.style.opacity = '0.5';
  });
});

// ── MAGNETIC BUTTONS ──
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
  });
  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ── HEADER SCROLL & HAMBURGER ──
const header = document.getElementById('header');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  header.classList.toggle('scrolled', currentScrollY > 40);
  
  if (mobileMenu.classList.contains('open')) {
    lastScrollY = currentScrollY;
    return;
  }
  
  if (currentScrollY > lastScrollY && currentScrollY > 100) {
    header.classList.add('hidden');
  } else {
    header.classList.remove('hidden');
  }
  lastScrollY = currentScrollY;
}, { passive: true });

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
document.querySelectorAll('.mob-link').forEach(link => {
  link.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ── REVEAL ON SCROLL ──
const reveals = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => revealObserver.observe(el));

// ── SKILL BAR ANIMATION ──
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-item').forEach((item, i) => {
        const pct = item.dataset.pct;
        setTimeout(() => {
          item.querySelector('.skill-fill').style.width = pct + '%';
        }, i * 120);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });
const skillBars = document.querySelector('.skill-bars');
if (skillBars) skillObserver.observe(skillBars);

// ── TYPEWRITER ──
const words = [
  'Future Lawyer',
  'Legal Researcher',
  'Litigation Specialist',
  'Moot Court Advocate',
  'Corporate Law Intern'
];
let wIdx = 0, cIdx = 0, deleting = false;
const twEl = document.getElementById('typewriter');

function type() {
  const word = words[wIdx];
  if (deleting) {
    twEl.textContent = word.slice(0, --cIdx);
  } else {
    twEl.textContent = word.slice(0, ++cIdx);
  }

  if (!deleting && cIdx === word.length) {
    deleting = true;
    setTimeout(type, 1800); return;
  }
  if (deleting && cIdx === 0) {
    deleting = false;
    wIdx = (wIdx + 1) % words.length;
  }
  setTimeout(type, deleting ? 45 : 90);
}
type();

// ── SMOOTH SCROLL for nav ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = header.offsetHeight;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ── MODAL ──
const modalOverlay = document.getElementById('modalOverlay');
const modalContent = document.getElementById('modalContent');

const certData = {
  cert1: {
    title: 'Internship Certificate',
    org: 'S.B. Deshmukh & Associates',
    date: 'Issued: March 10, 2026',
    desc: 'Successfully completed internship from 5th of June 2025 to 10th of March 2026, gaining practical experience in Civil, Criminal, and Family Law matters.',
    file: 'assets/certificates/sb-deshmukh-certificate.png'
  }
};

function openModal(key) {
  const d = certData[key];
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 0.25rem;">${d.title}</h3>
    <p class="modal-org" style="margin-bottom: 1rem;">${d.org}</p>
    <img src="${d.file}" alt="${d.title}" style="max-height: 38vh; width: auto; max-width: 100%; display: block; margin: 0 auto 1.25rem auto; border-radius: 6px; box-shadow: var(--shadow-sm);">
    <p style="margin-bottom: 1.25rem;">${d.desc}</p>
    <a href="${d.file}" download class="btn btn-gold" style="display:inline-flex; padding: 12px 28px;">Download Certificate</a>
  `;
  modalOverlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('active');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── CONTACT FORM ──
const form = document.getElementById('contactForm');
const toast = document.getElementById('toast');

form.addEventListener('submit', e => {
  e.preventDefault();
  // In production: hook up to Formspree, EmailJS, or similar
  form.reset();
  showToast();
});

function showToast() {
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

// ── ACTIVE NAV LINK on scroll ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => {
    if (window.scrollY >= s.offsetTop - 120) current = s.getAttribute('id');
  });
  navLinks.forEach(link => {
    link.classList.toggle('active-nav', link.getAttribute('href') === '#' + current);
  });
}, { passive: true });
