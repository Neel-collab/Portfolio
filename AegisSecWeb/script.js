/* ============================================================
   NEEL PODDAR — PORTFOLIO — SCRIPT
   3D Robot | GSAP Scroll Animations | Particles | Interactions
   ============================================================ */

// ─────── LOADING SCREEN ───────
(function () {
    const loadingScreen = document.getElementById('loadingScreen');
    const loaderBar = document.getElementById('loaderBar');
    const enterBtn = document.getElementById('enterBtn');
    let progress = 0;
    
    const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            setTimeout(() => {
                if(enterBtn) {
                    enterBtn.style.display = 'inline-flex';
                    // Force reflow
                    void enterBtn.offsetWidth;
                    enterBtn.style.opacity = '1';
                } else {
                    loadingScreen.classList.add('hidden');
                    initHeroAnimations();
                }
            }, 400);
        }
        loaderBar.style.width = progress + '%';
    }, 200);

    if(enterBtn) {
        enterBtn.addEventListener('click', () => {
            if (typeof audioCtx !== 'undefined' && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            if (typeof initBackgroundMusic === 'function') {
                initBackgroundMusic(); // This will play the <audio> tag
                if(typeof isMuted !== 'undefined' && isMuted) {
                    isMuted = false;
                    const st = document.getElementById('soundToggle');
                    if(st) st.classList.remove('muted');
                }
            }
            loadingScreen.classList.add('hidden');
            initHeroAnimations();
        });
    }
})();

// ─────── CUSTOM CURSOR ───────
(function () {
    const dot = document.getElementById('cursorDot');
    const ring = document.getElementById('cursorRing');
    if (!dot || !ring) return;
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', (e) => {
        mx = e.clientX;
        my = e.clientY;
        dot.style.left = mx - 4 + 'px';
        dot.style.top = my - 4 + 'px';
    });

    function animateRing() {
        rx += (mx - rx) * 0.15;
        ry += (my - ry) * 0.15;
        ring.style.left = rx - 20 + 'px';
        ring.style.top = ry - 20 + 'px';
        requestAnimationFrame(animateRing);
    }
    animateRing();

    document.querySelectorAll('a, button, .btn, .glass-card, .skill-pill, .nav-toggle').forEach(el => {
        el.addEventListener('mouseenter', () => ring.classList.add('hover'));
        el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
    });
})();

// ─────── PARTICLE BACKGROUND ───────
(function () {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, particles = [];
    const PARTICLE_COUNT = 80;
    const PINK = 'rgba(255, 20, 147,';

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() { this.reset(); }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.3;
            this.vy = (Math.random() - 0.5) * 0.3;
            this.size = Math.random() * 2 + 0.5;
            this.alpha = Math.random() * 0.5 + 0.1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = PINK + this.alpha + ')';
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const alpha = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = PINK + alpha + ')';
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);
        particles.forEach(p => { p.update(); p.draw(); });
        connectParticles();
        requestAnimationFrame(animate);
    }
    animate();
})();

// ─────── THREE.JS : PROCEDURAL AI ROBOT ───────
(function () {
    const canvas = document.getElementById('robotCanvas');
    if (!canvas || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 1, 6);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    // Lights
    const ambientLight = new THREE.AmbientLight(0x222233, 0.6);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 0.8);
    mainLight.position.set(5, 5, 5);
    scene.add(mainLight);

    const pinkLight = new THREE.PointLight(0xFF1493, 2, 15);
    pinkLight.position.set(-3, 2, 3);
    scene.add(pinkLight);

    const pinkLight2 = new THREE.PointLight(0xFF69B4, 1.5, 10);
    pinkLight2.position.set(3, -1, 2);
    scene.add(pinkLight2);

    const backLight = new THREE.PointLight(0x4400ff, 1, 10);
    backLight.position.set(0, 3, -5);
    scene.add(backLight);

    // Materials
    const bodyMat = new THREE.MeshPhongMaterial({
        color: 0x111122,
        specular: 0xFF1493,
        shininess: 80,
        emissive: 0x050510,
    });
    const accentMat = new THREE.MeshPhongMaterial({
        color: 0xFF1493,
        emissive: 0xFF1493,
        emissiveIntensity: 0.5,
        shininess: 100,
    });
    const glowMat = new THREE.MeshPhongMaterial({
        color: 0xFF69B4,
        emissive: 0xFF1493,
        emissiveIntensity: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    const darkMat = new THREE.MeshPhongMaterial({
        color: 0x0a0a15,
        specular: 0xFF1493,
        shininess: 60,
    });
    const visorMat = new THREE.MeshPhongMaterial({
        color: 0xFF1493,
        emissive: 0xFF1493,
        emissiveIntensity: 1,
        transparent: true,
        opacity: 0.85,
        shininess: 120,
    });

    const robot = new THREE.Group();

    // Head
    const headGroup = new THREE.Group();
    const headGeo = new THREE.BoxGeometry(1.2, 1, 1);
    const head = new THREE.Mesh(headGeo, bodyMat);
    // Rounded edges with chamfer
    headGroup.add(head);

    // Visor (eye area)
    const visorGeo = new THREE.BoxGeometry(1, 0.3, 0.15);
    const visor = new THREE.Mesh(visorGeo, visorMat);
    visor.position.set(0, 0.1, 0.5);
    headGroup.add(visor);

    // Eye lights
    const eyeGeo = new THREE.SphereGeometry(0.08, 16, 16);
    const leftEye = new THREE.Mesh(eyeGeo, glowMat);
    leftEye.position.set(-0.25, 0.12, 0.56);
    headGroup.add(leftEye);
    const rightEye = new THREE.Mesh(eyeGeo, glowMat);
    rightEye.position.set(0.25, 0.12, 0.56);
    headGroup.add(rightEye);

    // Antenna
    const antennaGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8);
    const antenna = new THREE.Mesh(antennaGeo, accentMat);
    antenna.position.set(0, 0.75, 0);
    headGroup.add(antenna);
    const antennaTip = new THREE.Mesh(new THREE.SphereGeometry(0.07, 12, 12), glowMat);
    antennaTip.position.set(0, 1.02, 0);
    headGroup.add(antennaTip);

    // Ear accents
    const earGeo = new THREE.BoxGeometry(0.08, 0.4, 0.4);
    const leftEar = new THREE.Mesh(earGeo, accentMat);
    leftEar.position.set(-0.65, 0, 0);
    headGroup.add(leftEar);
    const rightEar = new THREE.Mesh(earGeo, accentMat);
    rightEar.position.set(0.65, 0, 0);
    headGroup.add(rightEar);

    headGroup.position.y = 2.3;
    robot.add(headGroup);

    // Neck
    const neckGeo = new THREE.CylinderGeometry(0.2, 0.3, 0.4, 12);
    const neck = new THREE.Mesh(neckGeo, darkMat);
    neck.position.y = 1.7;
    robot.add(neck);

    // Torso
    const torsoGeo = new THREE.BoxGeometry(1.6, 1.8, 0.9);
    const torso = new THREE.Mesh(torsoGeo, bodyMat);
    torso.position.y = 0.7;
    robot.add(torso);

    // Chest plate / core
    const chestGeo = new THREE.BoxGeometry(0.8, 0.8, 0.15);
    const chest = new THREE.Mesh(chestGeo, darkMat);
    chest.position.set(0, 0.9, 0.5);
    robot.add(chest);

    // Chest core glow (arc reactor style)
    const coreGeo = new THREE.TorusGeometry(0.18, 0.04, 12, 24);
    const core = new THREE.Mesh(coreGeo, glowMat);
    core.position.set(0, 0.9, 0.58);
    robot.add(core);
    const coreCenterGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const coreCenter = new THREE.Mesh(coreCenterGeo, glowMat);
    coreCenter.position.set(0, 0.9, 0.58);
    robot.add(coreCenter);

    // Circuit lines on torso
    for (let i = 0; i < 4; i++) {
        const lineGeo = new THREE.BoxGeometry(0.02, 0.3, 0.02);
        const line = new THREE.Mesh(lineGeo, accentMat);
        line.position.set(-0.5 + i * 0.33, 0.3, 0.48);
        robot.add(line);
    }

    // Shoulders
    const shoulderGeo = new THREE.SphereGeometry(0.25, 16, 16);
    const leftShoulder = new THREE.Mesh(shoulderGeo, accentMat);
    leftShoulder.position.set(-1.05, 1.4, 0);
    robot.add(leftShoulder);
    const rightShoulder = new THREE.Mesh(shoulderGeo, accentMat);
    rightShoulder.position.set(1.05, 1.4, 0);
    robot.add(rightShoulder);

    // Arms
    const armGeo = new THREE.BoxGeometry(0.25, 1.2, 0.25);
    const leftArmGroup = new THREE.Group();
    const leftArm = new THREE.Mesh(armGeo, bodyMat);
    leftArm.position.y = -0.6;
    leftArmGroup.add(leftArm);
    // Forearm accent
    const forearmAccent = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.3, 0.27), accentMat);
    forearmAccent.position.y = -1;
    leftArmGroup.add(forearmAccent);
    // Hand
    const handGeo = new THREE.SphereGeometry(0.14, 12, 12);
    const leftHand = new THREE.Mesh(handGeo, darkMat);
    leftHand.position.y = -1.25;
    leftArmGroup.add(leftHand);
    leftArmGroup.position.set(-1.05, 1.4, 0);
    robot.add(leftArmGroup);

    const rightArmGroup = new THREE.Group();
    const rightArm = new THREE.Mesh(armGeo, bodyMat);
    rightArm.position.y = -0.6;
    rightArmGroup.add(rightArm);
    const forearmAccent2 = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.3, 0.27), accentMat);
    forearmAccent2.position.y = -1;
    rightArmGroup.add(forearmAccent2);
    const rightHand = new THREE.Mesh(handGeo, darkMat);
    rightHand.position.y = -1.25;
    rightArmGroup.add(rightHand);
    rightArmGroup.position.set(1.05, 1.4, 0);
    robot.add(rightArmGroup);

    // Waist
    const waistGeo = new THREE.BoxGeometry(1.2, 0.3, 0.7);
    const waist = new THREE.Mesh(waistGeo, darkMat);
    waist.position.y = -0.25;
    robot.add(waist);

    // Legs
    const legGeo = new THREE.BoxGeometry(0.3, 1.3, 0.3);
    const leftLeg = new THREE.Mesh(legGeo, bodyMat);
    leftLeg.position.set(-0.35, -1.1, 0);
    robot.add(leftLeg);
    const rightLeg = new THREE.Mesh(legGeo, bodyMat);
    rightLeg.position.set(0.35, -1.1, 0);
    robot.add(rightLeg);

    // Leg accents
    const legAccGeo = new THREE.BoxGeometry(0.32, 0.15, 0.32);
    const ll1 = new THREE.Mesh(legAccGeo, accentMat);
    ll1.position.set(-0.35, -0.7, 0);
    robot.add(ll1);
    const ll2 = new THREE.Mesh(legAccGeo, accentMat);
    ll2.position.set(0.35, -0.7, 0);
    robot.add(ll2);

    // Feet
    const footGeo = new THREE.BoxGeometry(0.35, 0.15, 0.5);
    const leftFoot = new THREE.Mesh(footGeo, darkMat);
    leftFoot.position.set(-0.35, -1.83, 0.1);
    robot.add(leftFoot);
    const rightFoot = new THREE.Mesh(footGeo, darkMat);
    rightFoot.position.set(0.35, -1.83, 0.1);
    robot.add(rightFoot);

    // Position robot
    robot.position.y = -0.3;
    scene.add(robot);

    // Floating rings
    const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(2, 0.015, 8, 64),
        new THREE.MeshBasicMaterial({ color: 0xFF1493, transparent: true, opacity: 0.3 })
    );
    ring1.position.y = 0.5;
    ring1.rotation.x = Math.PI / 3;
    scene.add(ring1);

    const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(2.5, 0.01, 8, 64),
        new THREE.MeshBasicMaterial({ color: 0xFF69B4, transparent: true, opacity: 0.2 })
    );
    ring2.position.y = 0.3;
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.z = Math.PI / 6;
    scene.add(ring2);

    // Floating data particles around robot
    const dataParticles = [];
    for (let i = 0; i < 30; i++) {
        const geo = new THREE.SphereGeometry(0.02, 8, 8);
        const mat = new THREE.MeshBasicMaterial({
            color: Math.random() > 0.5 ? 0xFF1493 : 0xFF69B4,
            transparent: true,
            opacity: 0.6,
        });
        const p = new THREE.Mesh(geo, mat);
        const angle = Math.random() * Math.PI * 2;
        const radius = 2 + Math.random() * 1.5;
        p.position.set(Math.cos(angle) * radius, (Math.random() - 0.5) * 4, Math.sin(angle) * radius);
        p.userData = { angle, radius, speed: 0.005 + Math.random() * 0.01, yOffset: p.position.y };
        scene.add(p);
        dataParticles.push(p);
    }

    // Mouse interaction
    let mouseX = 0, mouseY = 0;
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
        mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    });

    // Click Raycasting (Overclock)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let isOverclocked = false;

    canvas.addEventListener('click', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(robot.children, true);
        
        if (intersects.length > 0 && !isOverclocked) {
            isOverclocked = true;
            if (typeof playSound !== 'undefined') playSound('glitch');
            
            // Spin
            gsap.to(robot.rotation, {
                y: robot.rotation.y + Math.PI * 4,
                duration: 1.5,
                ease: "power2.inOut",
                onComplete: () => isOverclocked = false
            });
            
            // Pulse glow
            gsap.to(glowMat, { emissiveIntensity: 3, duration: 0.15, yoyo: true, repeat: 7 });
            gsap.to(pinkLight, { intensity: 8, duration: 0.15, yoyo: true, repeat: 7 });
        }
    });

    // Resize
    function handleResize() {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }
    window.addEventListener('resize', handleResize);

    // Animation loop
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.016;

        // Robot idle animation
        if (!isOverclocked) {
            robot.rotation.y += (mouseX * 0.5 - robot.rotation.y) * 0.05;
        }
        headGroup.rotation.y += (mouseX * 0.3 - headGroup.rotation.y) * 0.08;
        headGroup.rotation.x += (-mouseY * 0.15 - headGroup.rotation.x) * 0.08;

        // Floating bob
        robot.position.y = -0.3 + Math.sin(time * 1.5) * 0.1;

        // Arm sway
        leftArmGroup.rotation.x = Math.sin(time * 1.2) * 0.15;
        rightArmGroup.rotation.x = Math.sin(time * 1.2 + Math.PI) * 0.15;
        leftArmGroup.rotation.z = 0.1 + Math.sin(time) * 0.05;
        rightArmGroup.rotation.z = -0.1 - Math.sin(time) * 0.05;

        // Core pulse
        const coreScale = 1 + Math.sin(time * 3) * 0.1;
        core.scale.set(coreScale, coreScale, 1);
        coreCenter.scale.set(coreScale, coreScale, coreScale);

        // Antenna tip glow
        antennaTip.scale.setScalar(1 + Math.sin(time * 4) * 0.2);

        // Eye pulse (only when idle)
        if (!isOverclocked) {
            const eyeIntensity = 0.6 + Math.sin(time * 2) * 0.4;
            glowMat.emissiveIntensity = eyeIntensity;
        }

        // Floating rings
        ring1.rotation.z += 0.003;
        ring1.rotation.y += 0.002;
        ring2.rotation.z -= 0.002;
        ring2.rotation.y -= 0.003;

        // Data particles orbit
        dataParticles.forEach(p => {
            p.userData.angle += p.userData.speed;
            p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
            p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
            p.position.y = p.userData.yOffset + Math.sin(time + p.userData.angle) * 0.3;
        });

        // Lights
        if (!isOverclocked) {
            pinkLight.intensity = 2 + Math.sin(time * 2) * 0.5;
        }

        renderer.render(scene, camera);
    }
    animate();
})();

// ─────── TYPING EFFECT ───────
(function () {
    const el = document.getElementById('typingText');
    if (!el) return;
    const titles = [
        'Cybersecurity Enthusiast',
        'Full-Stack Developer',
        'Security Operations Intern',
        'BCA Student @ Christ University',
        'Aspiring Security Analyst @ IBM',
    ];
    let titleIndex = 0, charIndex = 0, isDeleting = false;

    function type() {
        const current = titles[titleIndex];
        if (!isDeleting) {
            el.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(type, 2000);
                return;
            }
            setTimeout(type, 60);
        } else {
            el.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                titleIndex = (titleIndex + 1) % titles.length;
                setTimeout(type, 500);
                return;
            }
            setTimeout(type, 30);
        }
    }
    setTimeout(type, 1500);
})();

// ─────── NAVBAR ───────
(function () {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navLinks.classList.toggle('open');
        });
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('active');
                navLinks.classList.remove('open');
            });
        });
    }
})();

// ─────── HERO ANIMATIONS (GSAP) ───────
function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to('.hero-name .word', {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.15,
    })
    .to('.hero-tag', { opacity: 1, y: 0, duration: 0.6 }, '-=0.6')
    .to('.hero-titles', { opacity: 1, y: 0, duration: 0.6 }, '-=0.4')
    .to('.hero-description', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('.hero-cta', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('.hero-stats', { opacity: 1, y: 0, duration: 0.6 }, '-=0.3')
    .to('.scroll-indicator', { opacity: 1, duration: 0.8 }, '-=0.2');

    // Counter animation
    document.querySelectorAll('.stat-number').forEach(el => {
        const target = parseInt(el.dataset.count);
        gsap.to(el, {
            textContent: target,
            duration: 2,
            snap: { textContent: 1 },
            delay: 1.2,
            ease: 'power2.out',
        });
    });
}

// ─────── SCROLL ANIMATIONS (GSAP ScrollTrigger) ───────
(function () {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
    gsap.registerPlugin(ScrollTrigger);

    // Section headers
    gsap.utils.toArray('.section-tag').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    gsap.utils.toArray('.section-title').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.8,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    gsap.utils.toArray('.section-line').forEach(el => {
        gsap.to(el, {
            opacity: 1,
            scaleX: 1,
            duration: 0.8,
            delay: 0.2,
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                toggleActions: 'play none none none',
            }
        });
    });

    // Reveal text elements
    gsap.utils.toArray('.reveal-text').forEach((el, i) => {
        gsap.to(el, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            delay: (i % 4) * 0.1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 88%',
                toggleActions: 'play none none none',
            }
        });
    });

    // Timeline line grow
    gsap.utils.toArray('.timeline-line').forEach(el => {
        gsap.fromTo(el,
            { scaleY: 0, transformOrigin: 'top' },
            {
                scaleY: 1,
                duration: 1.5,
                ease: 'power2.out',
                scrollTrigger: {
                    trigger: el.parentElement,
                    start: 'top 70%',
                    end: 'bottom 30%',
                    scrub: 1,
                }
            }
        );
    });

    // Skill pills - set level
    document.querySelectorAll('.skill-pill').forEach(pill => {
        const level = pill.dataset.level || 80;
        pill.style.setProperty('--skill-level', level + '%');
    });

})();

// ─────── SMOOTH SCROLL ───────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ─────── WEB AUDIO API (UI SOUNDS) ───────
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playSound(type) {
    if (audioCtx.state === 'suspended') return; // Don't play if blocked
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    if (type === 'hover') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1200, audioCtx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.02, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.1);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.1);
    } else if (type === 'click') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, audioCtx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.2);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.2);
    } else if (type === 'glitch') {
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(100, audioCtx.currentTime);
        osc.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.1);
        osc.frequency.linearRampToValueAtTime(50, audioCtx.currentTime + 0.3);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.linearRampToValueAtTime(0.001, audioCtx.currentTime + 0.4);
        osc.start();
        osc.stop(audioCtx.currentTime + 0.4);
    }
}

// ─────── BACKGROUND MUSIC (MP3 TRACK) ───────
let isMuted = true; // Start muted until interaction
const bgMusicElement = document.getElementById('bgMusic');
if (bgMusicElement) {
    bgMusicElement.volume = 0.4;
}

function initBackgroundMusic() {
    if (bgMusicElement && bgMusicElement.paused) {
        bgMusicElement.play().catch(e => console.log("Audio play failed:", e));
    }
}

const soundToggle = document.getElementById('soundToggle');
if (soundToggle) {
    // Set initial UI state
    soundToggle.classList.add('muted');
    
    soundToggle.addEventListener('click', () => {
        if (typeof audioCtx !== 'undefined' && audioCtx.state === 'suspended') audioCtx.resume();
        
        isMuted = !isMuted;
        soundToggle.classList.toggle('muted', isMuted);
        
        if (bgMusicElement) {
            if (isMuted) {
                bgMusicElement.pause();
            } else {
                bgMusicElement.play().catch(e => console.log("Audio play failed:", e));
            }
        }
    });
}

// Auto-play background music on first user interaction
document.body.addEventListener('click', (e) => {
    if (typeof audioCtx !== 'undefined' && audioCtx.state === 'suspended') audioCtx.resume();
    
    // If they click the sound toggle or hack toggle, let native listeners handle
    if (!e.target.closest('#soundToggle') && !e.target.closest('#hackToggle')) {
        if (isMuted) {
            isMuted = false;
            if(soundToggle) soundToggle.classList.remove('muted');
            if (bgMusicElement) {
                bgMusicElement.play().catch(e => console.log("Audio play failed:", e));
            }
        }
    }
}, { once: true });

// ─────── HACK MODE (GLITCH) ───────
const hackToggle = document.getElementById('hackToggle');
if (hackToggle) {
    hackToggle.addEventListener('click', () => {
        playSound('glitch');
        document.body.classList.toggle('hack-mode');
        
        if (document.body.classList.contains('hack-mode')) {
            // Scramble text effect
            document.querySelectorAll('h1, h2, h3').forEach(el => {
                const original = el.innerText;
                el.dataset.text = original;
                el.classList.add('glitch-anim');
                let iters = 0;
                const interval = setInterval(() => {
                    el.innerText = original.split('').map(char => 
                        Math.random() > 0.5 ? String.fromCharCode(33 + Math.floor(Math.random() * 94)) : char
                    ).join('');
                    if (++iters > 10) {
                        clearInterval(interval);
                        el.innerText = original;
                    }
                }, 50);
            });
        } else {
            document.querySelectorAll('.glitch-anim').forEach(el => {
                el.classList.remove('glitch-anim');
            });
        }
    });
}

// ─────── MAGNETIC ELEMENTS ───────
document.querySelectorAll('[data-magnetic]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const distanceX = e.clientX - centerX;
        const distanceY = e.clientY - centerY;
        
        gsap.to(el, {
            x: distanceX * 0.3,
            y: distanceY * 0.3,
            duration: 0.4,
            ease: 'power2.out'
        });
    });
    
    el.addEventListener('mouseenter', () => playSound('hover'));
    el.addEventListener('click', () => playSound('click'));

    el.addEventListener('mouseleave', () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.3)' });
    });
});

// ─────── 3D CARD TILT (VanillaTilt style) ───────
document.querySelectorAll('[data-tilt]').forEach(el => {
    el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        // Glare tracking
        el.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        el.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
        
        // Tilt math
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const tiltX = ((y - centerY) / centerY) * -5; // max 5 deg
        const tiltY = ((x - centerX) / centerX) * 5;

        gsap.to(el, {
            rotateX: tiltX,
            rotateY: tiltY,
            transformPerspective: 1000,
            duration: 0.4,
            ease: 'power2.out'
        });
    });

    el.addEventListener('mouseleave', () => {
        gsap.to(el, {
            rotateX: 0,
            rotateY: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.3)'
        });
    });
});

// ─────── INTERACTIVE TERMINAL ───────
(function() {
    const termWidget = document.getElementById('terminalWidget');
    const termToggleBtn = document.getElementById('termToggleBtn');
    const termClose = document.getElementById('termClose');
    const termCloseBtn = document.getElementById('termCloseBtn');
    const termInput = document.getElementById('termInput');
    const termOutput = document.getElementById('termOutput');
    const termHeader = document.getElementById('terminalHeader');
    
    if (!termWidget || !termInput) return;

    // Toggle logic
    termToggleBtn.addEventListener('click', () => {
        termWidget.classList.toggle('open');
        if (termWidget.classList.contains('open')) termInput.focus();
        playSound('click');
    });
    termClose.addEventListener('click', () => {
        termWidget.classList.remove('open');
    });
    termCloseBtn.addEventListener('click', () => {
        termWidget.classList.remove('open');
        playSound('click');
    });

    // Drag logic (mouse + touch)
    let isDragging = false, startX, startY, startLeft, startTop;

    function dragStart(clientX, clientY) {
        isDragging = true;
        startX = clientX; startY = clientY;
        const rect = termWidget.getBoundingClientRect();
        termWidget.style.bottom = 'auto';
        termWidget.style.right = 'auto';
        termWidget.style.left = rect.left + 'px';
        termWidget.style.top = rect.top + 'px';
        startLeft = rect.left; startTop = rect.top;
    }

    function dragMove(clientX, clientY) {
        if (!isDragging) return;
        let newLeft = startLeft + clientX - startX;
        let newTop = startTop + clientY - startY;
        // Clamp within viewport
        const w = termWidget.offsetWidth;
        const h = termWidget.offsetHeight;
        newLeft = Math.max(0, Math.min(window.innerWidth - w, newLeft));
        newTop = Math.max(0, Math.min(window.innerHeight - h, newTop));
        termWidget.style.left = newLeft + 'px';
        termWidget.style.top = newTop + 'px';
    }

    function dragEnd() { isDragging = false; }

    // Mouse
    termHeader.addEventListener('mousedown', (e) => dragStart(e.clientX, e.clientY));
    document.addEventListener('mousemove', (e) => dragMove(e.clientX, e.clientY));
    document.addEventListener('mouseup', dragEnd);

    // Touch
    termHeader.addEventListener('touchstart', (e) => {
        const t = e.touches[0];
        dragStart(t.clientX, t.clientY);
    }, { passive: true });
    document.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const t = e.touches[0];
        dragMove(t.clientX, t.clientY);
    }, { passive: false });
    document.addEventListener('touchend', dragEnd);

    // Command logic
    const commands = {
        'help': 'Available commands:<br>whoami, skills, projects, aegis, clear',
        'whoami': 'Neel Poddar - Cybersecurity Enthusiast & BCA Student',
        'skills': 'C, C++, Java, Python, React, Cybersecurity, SOC',
        'projects': 'AegisSec Terminal, ID Background Remover, Portfolio',
        'aegis': 'Initializing AegisSec Terminal Overrides... Access Granted.',
        'sudo': 'Nice try. This incident will be reported.'
    };

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const cmd = termInput.value.trim().toLowerCase();
            termInput.value = '';
            
            // Print prompt + command
            const pCmd = document.createElement('div');
            pCmd.innerHTML = `<span class="term-prompt">guest@neel_portfolio:~$</span> ${cmd}`;
            termOutput.appendChild(pCmd);

            if (cmd === 'clear') {
                termOutput.innerHTML = '';
            } else if (cmd) {
                const response = commands[cmd] || `bash: ${cmd}: command not found`;
                const pRes = document.createElement('div');
                pRes.innerHTML = response;
                termOutput.appendChild(pRes);
                
                if (cmd === 'aegis') {
                    playSound('glitch');
                    if(hackToggle) hackToggle.click(); // trigger hack mode easter egg
                }
            }
            termWidget.querySelector('.terminal-body').scrollTop = termWidget.querySelector('.terminal-body').scrollHeight;
        }
    });

    // Keep focus
    termWidget.addEventListener('click', () => {
        termInput.focus();
    });
})();
