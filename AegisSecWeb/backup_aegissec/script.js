document.addEventListener('DOMContentLoaded', () => {

    /* --- Navbar Scroll Effect --- */
    const navbar = document.querySelector('.navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Show navbar after scrolling down 100px
        if (currentScroll > 100) {
            navbar.classList.remove('hidden');
        } else {
            navbar.classList.add('hidden');
        }

        // Optional: Hide on scroll down, show on scroll up (disabled for now)
        // if (currentScroll > lastScroll && currentScroll > 200) {
        //     navbar.classList.add('hidden');
        // } else {
        //     navbar.classList.remove('hidden');
        // }

        lastScroll = currentScroll;
    });

    /* --- Intersection Observer for Scroll Animations --- */
    const revealElements = document.querySelectorAll('.reveal');
    const cards = document.querySelectorAll('.reveal-card');
    const listItems = document.querySelectorAll('.reveal-item');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Run once
            }
        });
    }, observerOptions);

    revealElements.forEach(el => scrollObserver.observe(el));

    // Staggered animations for cards
    cards.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
        scrollObserver.observe(card);
    });

    // Staggered animations for list items
    listItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
        scrollObserver.observe(item);
    });

    /* --- Custom Cursor Glow Tracker --- */
    const cursorGlow = document.querySelector('.cursor-glow');

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.top = `${e.clientY}px`;
        cursorGlow.style.left = `${e.clientX}px`;
    });

    /* --- HTML Canvas Golden Glitters Background --- */
    const container = document.getElementById('particles-container');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    container.appendChild(canvas);

    let width, height;
    let particles = [];
    const colors = ['rgba(255, 215, 0, 0.7)', 'rgba(218, 165, 32, 0.5)', 'rgba(238, 232, 170, 0.4)', 'rgba(255, 255, 255, 0.6)'];

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.init();
        }

        init() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.8;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.size = Math.random() * 2.5 + 0.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random();
            this.twinkleSpeed = 0.01 + Math.random() * 0.03;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.opacity += this.twinkleSpeed;

            if (this.opacity > 1 || this.opacity < 0.2) {
                this.twinkleSpeed *= -1;
            }

            if (this.x < 0) this.x = width;
            if (this.x > width) this.x = 0;
            if (this.y < 0) this.y = height;
            if (this.y > height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Drastically reduced string replacement overhead in active animation frames
            ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity * 0.5})`;
            ctx.fill();
            // Removed shadowBlur computations per-particle completely to eliminate GPU lag
        }
    }

    function initParticles() {
        particles = [];
        // Dramatically limit particle count on screen (divide by 35000 instead of 9000) to clear lag
        const particleCount = Math.floor((width * height) / 35000) + 10;
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();

    // Re-initialize particles if window vastly resizes
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            initParticles();
        }, 200);
    });

    /* --- Interactive Schema Tabs --- */
    const tabs = document.querySelectorAll('.schema-tab');
    const panes = document.querySelectorAll('.schema-pane');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs and panes
            tabs.forEach(t => t.classList.remove('active'));
            panes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and corresponding pane
            tab.classList.add('active');
            const targetId = tab.getAttribute('data-target');
            document.getElementById(targetId).classList.add('active');
        });
    });

    /* --- Counter Animation for Metrics --- */
    const counters = document.querySelectorAll('.counter');
    let hasCounted = false;

    const counterObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !hasCounted) {
            hasCounted = true;
            counters.forEach(counter => {
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;

                    // Lower increment to slow down animation
                    const inc = target / 100;

                    if (count < target) {
                        // Check if it's a decimal (e.g. 99.99 or 1.2)
                        if (target % 1 !== 0) {
                            counter.innerText = (count + inc).toFixed(2);
                        } else {
                            counter.innerText = Math.ceil(count + inc);
                        }
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
            });
        }
    }, { threshold: 0.5 });

    if (counters.length > 0) {
        counterObserver.observe(counters[0].parentElement.parentElement);
    }

    /* --- 3D Vanilla Tilt Effect --- */
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; // x position within the element
            const y = e.clientY - rect.top;  // y position within the element

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            // Calculate rotation (max 10 degrees)
            const rotateX = ((y - centerY) / centerY) * -10;
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
            card.style.transition = 'transform 0.5s ease';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'none';
        });
    });

    /* --- 3D Model Scroll Rotation --- */
    const modelViewer = document.getElementById('scroll-model');
    if (modelViewer) {
        window.addEventListener('scroll', () => {
            // Calculate scroll percentage (0 to 1)
            const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
            const scrollPercent = maxScroll > 0 ? window.scrollY / maxScroll : 0;
            
            // Map scroll percentage to an angle in degrees (540 deg = 1.5 full rotations)
            const currentAngle = scrollPercent * 540;
            
            // Update model-viewer's camera-orbit attribute ("azimuth polar-angle radius")
            modelViewer.setAttribute('camera-orbit', `${currentAngle}deg 75deg 105%`);
        });
    }

});


// Initialize Charts
document.addEventListener("DOMContentLoaded", () => {
    // Check if charts exist
    const barCtx = document.getElementById('barChart');
    if (barCtx) {
        const ctx = barCtx.getContext('2d');

        // Premium Cyber-Gold & Holographic Gradients
        const goldGrad = ctx.createLinearGradient(0, 0, 0, 400);
        goldGrad.addColorStop(0, 'rgba(255, 215, 0, 0.95)');
        goldGrad.addColorStop(0.5, 'rgba(255, 235, 59, 0.6)');
        goldGrad.addColorStop(1, 'rgba(218, 165, 32, 0.1)');

        const holoGrad = ctx.createLinearGradient(0, 0, 0, 400);
        holoGrad.addColorStop(0, 'rgba(187, 134, 252, 0.95)');
        holoGrad.addColorStop(0.5, 'rgba(103, 58, 183, 0.6)');
        holoGrad.addColorStop(1, 'rgba(49, 27, 146, 0.1)');

        new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: ['10k', '50k', '100k', '500k', '1M'],
                datasets: [{
                    label: 'AegisSec Native BSON',
                    data: [12, 18, 25, 45, 80],
                    backgroundColor: goldGrad,
                    borderColor: '#ffd700',
                    borderWidth: 2,
                    borderRadius: 12,
                    hoverBackgroundColor: '#ffd700',
                    hoverBorderColor: '#fff',
                    hoverBorderWidth: 4
                },
                {
                    label: 'Traditional ORM',
                    data: [45, 120, 280, 850, 1950],
                    backgroundColor: holoGrad,
                    borderColor: '#bb86fc',
                    borderWidth: 2,
                    borderRadius: 12,
                    hoverBackgroundColor: '#bb86fc',
                    hoverBorderColor: '#fff',
                    hoverBorderWidth: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 4000,
                    easing: 'easeOutElastic',
                    delay: (context) => context.dataIndex * 200
                },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: {
                        labels: {
                            color: '#c9d1d9',
                            font: { family: 'Outfit, sans-serif', size: 14, weight: 'bold' },
                            usePointStyle: true,
                            padding: 20
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(13, 17, 23, 0.95)',
                        cornerRadius: 12,
                        padding: 15,
                        borderColor: 'rgba(255, 215, 0, 0.4)',
                        borderWidth: 1,
                        callbacks: {
                            label: (ctx) => ` ⚡ ${ctx.dataset.label}: ${ctx.parsed.y}ms`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(255,255,255,0.03)' },
                        ticks: { color: '#8b949e', font: { family: 'Consolas' } },
                        title: { display: true, text: 'Execution Time (ms)', color: 'rgba(255,215,0,0.7)' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#8b949e', font: { family: 'Consolas' } },
                        title: { display: true, text: 'Transaction Load', color: 'rgba(255,215,0,0.7)' }
                    }
                }
            }
        });
    }

    const pieCtx = document.getElementById('pieChart');
    if (pieCtx) {
        new Chart(pieCtx, {
            type: 'doughnut',
            data: {
                labels: ['UI Buffer', 'TCP Sockets', 'Security Logs', 'GC Threads'],
                datasets: [{
                    data: [45, 20, 25, 10],
                    backgroundColor: [
                        'rgba(255, 215, 0, 0.9)',
                        'rgba(0, 229, 255, 0.9)',
                        'rgba(187, 134, 252, 0.9)',
                        'rgba(255, 82, 82, 0.9)'
                    ],
                    borderColor: '#0d1117',
                    borderWidth: 8,
                    hoverOffset: 35
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                animation: {
                    animateRotate: true,
                    animateScale: true,
                    duration: 3500,
                    easing: 'easeOutBack'
                },
                plugins: {
                    legend: {
                        position: 'right',
                        labels: {
                            color: '#c9d1d9',
                            font: { family: 'Outfit, sans-serif', weight: 'bold' },
                            padding: 25,
                            usePointStyle: true
                        }
                    }
                }
            }
        });
    }
});
