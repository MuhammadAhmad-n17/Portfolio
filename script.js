/* ═══════════════════════════════════════════════
   MUHAMMAD AHMAD — WARRIOR PORTFOLIO v2
   World-Class Interactions & Effects
   ═══════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── PRELOADER ─── */
    const preloader = document.getElementById('preloader');
    const finishPreloader = () => preloader.classList.add('done');
    window.addEventListener('load', () => setTimeout(finishPreloader, 2400));
    setTimeout(finishPreloader, 4500); // fallback

    /* ─── CUSTOM CURSOR ─── */
    const dot = document.getElementById('cursor-dot');
    const ring = document.getElementById('cursor-ring');
    let mx = 0, my = 0, rx = 0, ry = 0;

    if (window.innerWidth > 768 && dot && ring) {
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            dot.style.left = (mx - 3) + 'px';
            dot.style.top = (my - 3) + 'px';
        });
        (function animRing() {
            rx += (mx - rx) * 0.1;
            ry += (my - ry) * 0.1;
            ring.style.left = (rx - 18) + 'px';
            ring.style.top = (ry - 18) + 'px';
            requestAnimationFrame(animRing);
        })();
        document.querySelectorAll('a, button, .skill-hex, .honor-card, .c-card, .proj-img-wrap').forEach(el => {
            el.addEventListener('mouseenter', () => ring.classList.add('hov'));
            el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
        });
    }

    /* ─── FULL-PAGE ASHES & EMBERS CANVAS ─── */
    const ashCanvas = document.getElementById('ash-canvas');
    if (ashCanvas) {
        const ctx = ashCanvas.getContext('2d');
        let cw, ch;
        let particles = [];
        let clickSparks = [];
        let mouseX = -1000, mouseY = -1000;
        let lastScrollY = window.scrollY;
        let scrollVelocity = 0;

        function resizeAshCanvas() {
            cw = ashCanvas.width = window.innerWidth;
            ch = ashCanvas.height = window.innerHeight;
        }
        resizeAshCanvas();
        window.addEventListener('resize', resizeAshCanvas);

        document.addEventListener('mousemove', e => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        // Click spark explosion
        document.addEventListener('pointerdown', e => {
            const count = 12;
            for (let i = 0; i < count; i++) {
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 1.5;
                clickSparks.push({
                    x: e.clientX,
                    y: e.clientY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 1.2,
                    r: Math.random() * 2.5 + 1,
                    life: 1,
                    decay: Math.random() * 0.03 + 0.02,
                    color: Math.random() > 0.4 ? [255, 180, 50] : [231, 76, 60]
                });
            }
        });

        // Scroll velocity for wind puff
        window.addEventListener('scroll', () => {
            const currentY = window.scrollY;
            scrollVelocity = (currentY - lastScrollY) * 0.08;
            lastScrollY = currentY;
        }, { passive: true });

        // Ash Flake (tumbles slowly downward or hovers)
        class AshFlake {
            constructor() { this.init(true); }
            init(scatter = false) {
                this.x = Math.random() * cw;
                this.y = scatter ? Math.random() * ch : -10;
                this.w = Math.random() * 4 + 2;
                this.h = Math.random() * 3 + 1.5;
                this.vx = (Math.random() - 0.5) * 0.4;
                this.vy = Math.random() * 0.4 + 0.25;
                this.rot = Math.random() * Math.PI * 2;
                this.rotV = (Math.random() - 0.5) * 0.025;
                this.flip = Math.random() * Math.PI;
                this.flipV = Math.random() * 0.02 + 0.01;
                this.opacity = Math.random() * 0.35 + 0.15;
                // Grey / dark soot ash
                const grays = [
                    [55, 50, 55],
                    [75, 70, 75],
                    [100, 95, 100],
                    [140, 130, 135]
                ];
                this.color = grays[Math.floor(Math.random() * grays.length)];
                this.swaySpeed = Math.random() * 0.002 + 0.001;
                this.swayOffset = Math.random() * 100;
            }
            update(time) {
                this.x += this.vx + Math.sin(time * this.swaySpeed + this.swayOffset) * 0.35;
                this.y += this.vy + (scrollVelocity * 0.15);
                this.rot += this.rotV;
                this.flip += this.flipV;

                // Mouse avoidance
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 70) {
                    const force = (70 - dist) / 70;
                    this.x += (dx / dist) * force * 1.5;
                    this.y += (dy / dist) * force * 1.5;
                }

                if (this.y > ch + 20) this.init(false);
                if (this.x < -30) this.x = cw + 20;
                if (this.x > cw + 30) this.x = -20;
            }
            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.rot);
                ctx.scale(1, Math.cos(this.flip));
                const [r, g, b] = this.color;
                ctx.fillStyle = `rgba(${r},${g},${b},${this.opacity})`;
                ctx.beginPath();
                ctx.ellipse(0, 0, this.w, this.h, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Glowing Ember (floats upward from warrior fires)
        class GlowingEmber {
            constructor() { this.init(true); }
            init(scatter = false) {
                this.x = Math.random() * cw;
                this.y = scatter ? Math.random() * ch : ch + 15;
                this.r = Math.random() * 2 + 0.6;
                this.vx = (Math.random() - 0.5) * 0.45;
                this.vy = -(Math.random() * 0.65 + 0.35); // upwards!
                this.pulse = Math.random() * Math.PI * 2;
                this.pulseSpeed = Math.random() * 0.04 + 0.015;
                this.baseAlpha = Math.random() * 0.45 + 0.25;
                const palette = [
                    [231, 76, 60],   // Crimson
                    [243, 156, 18],  // Amber gold
                    [255, 120, 40],  // Flame orange
                    [255, 205, 90],  // Hot gold
                    [180, 20, 20]    // Deep blood red
                ];
                this.color = palette[Math.floor(Math.random() * palette.length)];
                this.swayFreq = Math.random() * 0.003 + 0.001;
            }
            update(time) {
                this.pulse += this.pulseSpeed;
                this.x += this.vx + Math.sin(time * this.swayFreq) * 0.4;
                this.y += this.vy - (scrollVelocity * 0.2);

                // Mouse avoidance draft
                const dx = this.x - mouseX;
                const dy = this.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 85) {
                    const force = (85 - dist) / 85;
                    this.x += (dx / dist) * force * 2;
                    this.y += (dy / dist) * force * 2;
                }

                if (this.y < -20) this.init(false);
                if (this.x < -20) this.x = cw + 15;
                if (this.x > cw + 20) this.x = -15;
            }
            draw() {
                const alpha = Math.max(0.1, this.baseAlpha + Math.sin(this.pulse) * 0.2);
                const [r, g, b] = this.color;
                ctx.save();
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`;
                ctx.shadowColor = `rgba(${r},${g},${b},${alpha * 0.8})`;
                ctx.shadowBlur = this.r * 5;
                ctx.fill();
                ctx.restore();
            }
        }

        // Initialize particle set
        const emberCount = Math.min(65, Math.floor(window.innerWidth / 24));
        const ashCount = Math.min(45, Math.floor(window.innerWidth / 35));

        for (let i = 0; i < emberCount; i++) particles.push(new GlowingEmber());
        for (let i = 0; i < ashCount; i++) particles.push(new AshFlake());

        let lastTime = 0;
        function renderAshes(time) {
            ctx.clearRect(0, 0, cw, ch);

            // Decay scroll velocity smoothly
            scrollVelocity *= 0.92;

            // Draw ambient particles
            for (let i = 0; i < particles.length; i++) {
                particles[i].update(time);
                particles[i].draw();
            }

            // Draw click sparks
            for (let i = clickSparks.length - 1; i >= 0; i--) {
                const s = clickSparks[i];
                s.x += s.vx;
                s.y += s.vy;
                s.vy += 0.08; // gravity
                s.life -= s.decay;
                if (s.life <= 0) {
                    clickSparks.splice(i, 1);
                    continue;
                }
                const [r, g, b] = s.color;
                ctx.save();
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * s.life, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${r},${g},${b},${s.life})`;
                ctx.shadowColor = `rgba(${r},${g},${b},${s.life})`;
                ctx.shadowBlur = 8;
                ctx.fill();
                ctx.restore();
            }

            requestAnimationFrame(renderAshes);
        }
        requestAnimationFrame(renderAshes);
    }

    /* ─── NAVBAR & SCROLL PROGRESS & BACK TO TOP ─── */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const allSections = document.querySelectorAll('section[id]');
    const progressBar = document.getElementById('scroll-progress');
    const backToTopBtn = document.getElementById('back-to-top');

    function onScroll() {
        const sy = window.scrollY;
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

        // Navbar blur toggle
        if (navbar) navbar.classList.toggle('stuck', sy > 60);

        // Reading progress bar
        if (progressBar && maxScroll > 0) {
            const pct = Math.min(100, Math.max(0, (sy / maxScroll) * 100));
            progressBar.style.width = pct + '%';
        }

        // Back to top button visibility
        if (backToTopBtn) {
            backToTopBtn.classList.toggle('visible', sy > 400);
        }

        // Active section spy
        let cur = '';
        allSections.forEach(s => {
            if (sy >= s.offsetTop - 160) cur = s.id;
        });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.dataset.section === cur);
        });
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ─── MOBILE MENU ─── */
    const toggle = document.getElementById('nav-toggle');
    const mobileOverlay = document.getElementById('mobile-overlay');
    const mobLinks = document.querySelectorAll('.mob-link, .mob-cta');

    if (toggle && mobileOverlay) {
        toggle.addEventListener('click', () => {
            toggle.classList.toggle('open');
            mobileOverlay.classList.toggle('open');
            document.body.style.overflow = mobileOverlay.classList.contains('open') ? 'hidden' : '';
        });
        mobLinks.forEach(l => l.addEventListener('click', () => {
            toggle.classList.remove('open');
            mobileOverlay.classList.remove('open');
            document.body.style.overflow = '';
        }));
    }

    /* ─── SCROLL REVEAL ─── */
    const animEls = document.querySelectorAll('[data-anim]');
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                const d = parseFloat(e.target.dataset.delay || 0) * 1000;
                setTimeout(() => e.target.classList.add('show'), d);
                revealObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
    animEls.forEach(el => revealObs.observe(el));

    /* ─── COUNTER ANIMATION ─── */
    const counters = document.querySelectorAll('[data-count]');
    let counted = false;
    const cntObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting && !counted) {
                counted = true;
                counters.forEach(c => {
                    const t = +c.dataset.count;
                    let cur = 0;
                    const step = t / 50;
                    const iv = setInterval(() => {
                        cur += step;
                        if (cur >= t) { c.textContent = t; clearInterval(iv); }
                        else c.textContent = Math.floor(cur);
                    }, 35);
                });
            }
        });
    }, { threshold: 0.5 });
    counters.forEach(c => cntObs.observe(c));

    /* ─── SKILL PROGRESS BARS ─── */
    const skillBars = document.querySelectorAll('.hex-fill');
    const barObs = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('animated'), 300);
                barObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });
    skillBars.forEach(b => barObs.observe(b));

    /* ─── 3D TILT — PROJECT IMAGES ─── */
    if (window.innerWidth > 768) {
        document.querySelectorAll('.proj-img-wrap').forEach(wrap => {
            wrap.addEventListener('mousemove', e => {
                const r = wrap.getBoundingClientRect();
                const x = e.clientX - r.left;
                const y = e.clientY - r.top;
                const rx = (y - r.height / 2) / 18;
                const ry = (r.width / 2 - x) / 18;
                wrap.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.02)`;
            });
            wrap.addEventListener('mouseleave', () => {
                wrap.style.transform = '';
            });
        });
    }

    /* ─── 3D TILT — HERO WARRIOR ─── */
    const heroWrap = document.querySelector('.hero-img-wrap');
    const heroImg = document.getElementById('hero-warrior');
    if (heroWrap && heroImg && window.innerWidth > 768) {
        heroWrap.addEventListener('mousemove', e => {
            const r = heroWrap.getBoundingClientRect();
            const rx = (e.clientY - r.top - r.height / 2) / 22;
            const ry = (r.width / 2 - (e.clientX - r.left)) / 22;
            heroImg.style.transform = `scale(1.03) rotateX(${rx}deg) rotateY(${ry}deg)`;
        });
        heroWrap.addEventListener('mouseleave', () => {
            heroImg.style.transform = '';
        });
    }

    /* ─── FLOAT BADGES (appear after preloader) ─── */
    setTimeout(() => {
        document.querySelectorAll('.float-badge').forEach((b, i) => {
            setTimeout(() => b.classList.add('visible'), i * 400 + 500);
        });
    }, 2800);

    /* ─── SKILL CARD GLOW FOLLOW ─── */
    if (window.innerWidth > 768) {
        document.querySelectorAll('.hex-inner').forEach(card => {
            card.addEventListener('mousemove', e => {
                const rect = card.getBoundingClientRect();
                const glow = card.querySelector('.hex-glow');
                if (glow) {
                    glow.style.left = (e.clientX - rect.left - 100) + 'px';
                    glow.style.top = (e.clientY - rect.top - 100) + 'px';
                }
            });
        });
    }

    /* ─── CONTACT FORM ─── */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', e => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const orig = btn.innerHTML;
            btn.innerHTML = '<span>Message Sent Successfully</span>';
            btn.style.background = 'linear-gradient(135deg,#0d7a3e,#15a053)';
            setTimeout(() => { btn.innerHTML = orig; btn.style.background = ''; form.reset(); }, 3000);
        });
    }

    /* ─── SMOOTH SCROLL ─── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', e => {
            e.preventDefault();
            const t = document.querySelector(a.getAttribute('href'));
            if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });

    /* ─── PARALLAX HERO BG ─── */
    if (window.innerWidth > 768) {
        const g1 = document.querySelector('.hero-gradient-1');
        const g2 = document.querySelector('.hero-gradient-2');
        window.addEventListener('scroll', () => {
            const sy = window.scrollY;
            if (sy < window.innerHeight && g1 && g2) {
                g1.style.transform = `translate(${Math.sin(sy * 0.002) * 30}px, ${sy * 0.15}px)`;
                g2.style.transform = `translate(${Math.cos(sy * 0.002) * 20}px, ${sy * 0.1}px)`;
            }
        }, { passive: true });
    }

    /* ─── HONOR CARDS — tilt on hover ─── */
    if (window.innerWidth > 768) {
        document.querySelectorAll('.honor-card').forEach(card => {
            card.addEventListener('mousemove', e => {
                const r = card.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width;
                const y = (e.clientY - r.top) / r.height;
                const tiltX = (y - 0.5) * 10;
                const tiltY = (0.5 - x) * 10;
                card.style.transform = `translateY(-8px) perspective(600px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
            });
        });
    }
});
