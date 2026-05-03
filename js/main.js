// Mobile Nav Toggle (robust)
document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = links.classList.toggle('open');
        toggle.setAttribute('aria-expanded', String(isOpen));
    });

    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
    }));
});

// Reveal Animation via IntersectionObserver (inkl. Reduced Motion)
(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
        document.querySelectorAll('.reveal').forEach(el => el.classList.add('active'));
        return;
    }

    const io = new IntersectionObserver((entries, obs) => {
        for (const e of entries) {
            if (e.isIntersecting) {
                e.target.classList.add('active');
                obs.unobserve(e.target);
            }
        }
    }, { threshold: 0.12 });

    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
})();

// Flow Progress in "How it works"
(function () {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const steps = document.getElementById('flowSteps');
    if (!steps || prefersReduced) return;

    let isActive = false;

    const clamp01 = (v) => Math.max(0, Math.min(1, v));

    const update = () => {
        if (!isActive) return;

        const rect = steps.getBoundingClientRect();
        const vh = window.innerHeight || document.documentElement.clientHeight;

        const start = vh * 0.85;
        const end = vh * 0.15;

        const total = (rect.height + (start - end));
        const progressed = (start - rect.top);

        const p = clamp01(progressed / total);
        steps.style.setProperty('--flow-progress', (p * 100).toFixed(2) + '%');
    };

    const io = new IntersectionObserver((entries) => {
        for (const e of entries) {
            if (e.target !== steps) continue;
            isActive = e.isIntersecting;
            if (isActive) update();
        }
    }, { threshold: 0.05 });

    io.observe(steps);

    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
})();

/* Nav show/hide on scroll (reversible) */
(function () {
    const nav = document.querySelector('nav');
    if (!nav) return;

    let lastY = window.scrollY;
    const threshold = 12; // deadzone

    window.addEventListener('scroll', () => {
        const currentY = window.scrollY;
        const delta = currentY - lastY;
        if (Math.abs(delta) < threshold) return;

        if (delta > 0 && currentY > 120) {
            nav.classList.add('nav-hidden');
        } else {
            nav.classList.remove('nav-hidden');
        }
        lastY = currentY;
    }, { passive: true });
})();
