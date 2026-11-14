const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('#primary-menu');
document.documentElement.classList.add('js-ready');

function closeMenu() {
  menuToggle?.setAttribute('aria-expanded', 'false');
  menuToggle?.setAttribute('aria-label', 'Open navigation menu');
  navMenu?.classList.remove('menu-visible');
  document.body.classList.remove('menu-open');
}

menuToggle?.addEventListener('click', () => {
  const open = menuToggle.getAttribute('aria-expanded') !== 'true';
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
  navMenu?.classList.toggle('menu-visible', open);
  document.body.classList.toggle('menu-open', open);
});

navMenu?.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -25px 0px' });
  document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

  const countObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = entry.target;
      const end = Number(target.dataset.count);
      const suffix = target.dataset.suffix || '';
      const start = performance.now();
      const duration = 850;
      const tick = (now) => {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        target.textContent = `${Math.round(end * eased)}${suffix}`;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(target);
    });
  }, { threshold: 0.6 });
  document.querySelectorAll('[data-count]').forEach((element) => countObserver.observe(element));
} else {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
}

const dialogButtons = document.querySelectorAll('[data-dialog-target]');
dialogButtons.forEach((button) => {
  const dialog = document.getElementById(button.dataset.dialogTarget);
  if (!dialog) return;
  button.addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.dialog-close')?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target === dialog) dialog.close();
  });
});

const navLinks = [...document.querySelectorAll('.nav-menu a[href^="#"]')];
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.classList.add('nav-active');
        else link.classList.remove('nav-active');
      });
    });
  }, { rootMargin: '-35% 0px -58% 0px' });
  ['home', 'about', 'services', 'work', 'experience', 'contact'].forEach((id) => {
    const section = document.getElementById(id);
    if (section) sectionObserver.observe(section);
  });
}

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const form = new FormData(contactForm);
  const subject = String(form.get('subject')).trim();
  const body = [
    `Name: ${String(form.get('name')).trim()}`,
    `Email: ${String(form.get('email')).trim()}`,
    '',
    String(form.get('message')).trim(),
  ].join('\n');
  const mailto = `mailto:igbafejoan@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  if (formStatus) formStatus.textContent = 'Opening your email app now. Please review the message there and send it when ready.';
  window.location.href = mailto;
});
