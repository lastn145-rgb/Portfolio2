/**
 * TODAY PORTFOLIO - MAIN JAVASCRIPT
 * Dark futuristic UI with glassmorphism, neon gradients, and smooth animations
 * 
 * Features:
 * - Loading screen animation
 * - Particle canvas background
 * - Typing animation for hero roles
 * - Scroll reveal with IntersectionObserver
 * - Skill bar animations
 * - Circular progress indicators
 * - Stats count-up animation
 * - Testimonial slider with auto-play
 * - Project filtering with transitions
 * - 3D tilt effect on project cards
 * - Mouse tracking glow on cards
 * - Navbar scroll behavior & active section detection
 * - Mobile menu with overlay
 * - Form validation with floating labels
 * - Cursor glow effect (desktop)
 * - Scroll-to-top button
 */

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Initialize all modules
    initLoadingScreen();
    initTypingAnimation();
    initParticleCanvas();
    initScrollReveal();
    initSkillBars();
    initCircularProgress();
    initCountUp();
    initTestimonialSlider();
    initProjectFilter();
    initProjectTilt();
    initCardGlow();
    initNavbarBehavior();
    initMobileMenu();
    initFormValidation();
    initCursorGlow();
    initScrollToTop();
    initStatusTextCycle();
    initAnimatedDividers();

    // Set dynamic year in footer
    const yearEl = document.getElementById('footer-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});

// ==================== LOADING SCREEN ====================

function initLoadingScreen() {
    const loadingScreen = document.getElementById('loading-screen');
    if (!loadingScreen) return;

    // Dismiss loading screen after 1.8 seconds
    setTimeout(() => {
        loadingScreen.classList.add('hidden');
        // Add loaded class to body to trigger hero entrance animations
        setTimeout(() => {
            document.body.classList.add('loaded');
        }, 100);
        // Remove from DOM after transition
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 700);
    }, 1800);
}

// ==================== TYPING ANIMATION ====================

function initTypingAnimation() {
    const typingElement = document.getElementById('typing-text');
    if (!typingElement) return;

    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        typingElement.textContent = 'Web Developer';
        return;
    }

    const roles = ['Web Developer', 'Frontend Developer', 'UI Designer', 'JavaScript Developer'];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    const TYPING_SPEED = 100;
    const DELETING_SPEED = 50;
    const PAUSE_AFTER_TYPE = 2000;
    const PAUSE_AFTER_DELETE = 500;

    function type() {
        const currentRole = roles[roleIndex];

        if (isPaused) return;

        if (isDeleting) {
            // Deleting characters
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;

            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                isPaused = true;
                setTimeout(() => {
                    isPaused = false;
                    type();
                }, PAUSE_AFTER_DELETE);
                return;
            }

            setTimeout(type, DELETING_SPEED);
        } else {
            // Typing characters
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;

            if (charIndex === currentRole.length) {
                isPaused = true;
                setTimeout(() => {
                    isDeleting = true;
                    isPaused = false;
                    type();
                }, PAUSE_AFTER_TYPE);
                return;
            }

            setTimeout(type, TYPING_SPEED);
        }
    }

    // Start typing animation after hero entrance
    setTimeout(type, 600);
}

// ==================== PARTICLE CANVAS ====================

function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId = null;
    let isVisible = true;
    let frameCount = 0;

    // Check if mobile
    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 15 : 40;
    const CONNECTION_DISTANCE = isMobile ? 100 : 150;

    let particles = [];

    function resizeCanvas() {
        const hero = document.getElementById('hero');
        if (!hero) return;
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }

    function createParticles() {
        particles = [];
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.6,
                vy: (Math.random() - 0.5) * 0.6,
                radius: Math.random() * 3 + 2,
                opacity: Math.random() * 0.2 + 0.1
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONNECTION_DISTANCE) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(56, 189, 248, ${0.05 * (1 - dist / CONNECTION_DISTANCE)})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Draw particles
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(56, 189, 248, ${p.opacity})`;
            ctx.fill();
        });
    }

    function updateParticles() {
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;

            // Bounce off edges
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

            // Keep in bounds
            p.x = Math.max(0, Math.min(canvas.width, p.x));
            p.y = Math.max(0, Math.min(canvas.height, p.y));
        });
    }

    function animate() {
        if (!isVisible) {
            animationId = requestAnimationFrame(animate);
            return;
        }

        frameCount++;
        // Render at ~30fps for performance
        if (frameCount % 2 === 0) {
            updateParticles();
            drawParticles();
        }

        animationId = requestAnimationFrame(animate);
    }

    // Use IntersectionObserver to pause when hero is not visible
    const hero = document.getElementById('hero');
    if (hero) {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    isVisible = entry.isIntersecting;
                });
            },
            { threshold: 0.05 }
        );
        observer.observe(hero);
    }

    resizeCanvas();
    createParticles();
    animate();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });
}

// ==================== SCROLL REVEAL ====================

function initScrollReveal() {
    // Don't animate if reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    // Add reveal classes to elements
    const revealElements = document.querySelectorAll(
        '.about-heading, .about-bio, .stat-card, .skill-item, .circular-progress-item, ' +
        '.tech-item, .project-card, .service-card, .testimonials-slider-wrapper, ' +
        '.slider-dots, .contact-item, .contact-socials, .contact-form, .filter-tabs'
    );

    revealElements.forEach((el, index) => {
        el.classList.add('reveal');
        // Add stagger delay based on parent grouping
        const siblings = Array.from(el.parentElement.children);
        const siblingIndex = siblings.indexOf(el);
        if (siblingIndex < 6) {
            el.classList.add(`reveal-delay-${Math.min(siblingIndex + 1, 5)}`);
        }
    });

    // About section - special left/right animations
    const aboutLeft = document.querySelector('.about-left');
    const aboutRight = document.querySelector('.about-right');
    if (aboutLeft) aboutLeft.classList.add('reveal-left');
    if (aboutRight) aboutRight.classList.add('reveal-right');

    // Contact section - special left/right animations
    const contactLeft = document.querySelector('.contact-left');
    const contactRight = document.querySelector('.contact-right');
    if (contactLeft) contactLeft.classList.add('reveal-left');
    if (contactRight) contactRight.classList.add('reveal-right');

    // Create observer - trigger when element is 15% visible
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    // Observe all reveal elements
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        observer.observe(el);
    });

    // Also immediately reveal elements that are already in viewport
    setTimeout(() => {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.classList.add('revealed');
            }
        });
    }, 100);
}

// ==================== SKILL BARS ====================

function initSkillBars() {
    const skillFills = document.querySelectorAll('.skill-fill');
    if (!skillFills.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        const targetWidth = entry.target.getAttribute('data-width');
                        entry.target.style.width = targetWidth + '%';
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    skillFills.forEach(fill => observer.observe(fill));
}

// ==================== CIRCULAR PROGRESS ====================

function initCircularProgress() {
    const circles = document.querySelectorAll('.circle-fill');
    if (!circles.length) return;

    const circumference = 2 * Math.PI * 54; // radius = 54

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const circle = entry.target;
                    const percent = parseInt(circle.getAttribute('data-percent'));
                    const offset = circumference - (percent / 100) * circumference;

                    setTimeout(() => {
                        circle.style.strokeDashoffset = offset;
                    }, index * 100);

                    // Animate percentage number
                    const percentEl = circle.closest('.circular-progress-item').querySelector('.circle-percent');
                    if (percentEl) {
                        animateNumber(percentEl, 0, percent, 1500, '%');
                    }

                    observer.unobserve(circle);
                }
            });
        },
        { threshold: 0.5 }
    );

    circles.forEach(circle => observer.observe(circle));
}

// ==================== COUNT UP ANIMATION ====================

function initCountUp() {
    const statNumbers = document.querySelectorAll('.stat-number');
    if (!statNumbers.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    const target = parseInt(entry.target.getAttribute('data-target'));
                    setTimeout(() => {
                        animateNumber(entry.target, 0, target, 1500, '');
                    }, index * 200);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    statNumbers.forEach(el => observer.observe(el));
}

function animateNumber(element, start, end, duration, suffix) {
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(start + (end - start) * eased);
        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

// ==================== TESTIMONIAL SLIDER ====================

function initTestimonialSlider() {
    const cards = document.querySelectorAll('.testimonial-card');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const sliderWrapper = document.querySelector('.testimonials-slider-wrapper');

    if (!cards.length) return;

    let currentIndex = 0;
    let intervalId = null;
    let isPaused = false;
    const AUTO_SLIDE_INTERVAL = 5000;

    function showSlide(index) {
        // Hide all cards
        cards.forEach(card => {
            card.classList.remove('active');
        });
        dots.forEach(dot => dot.classList.remove('active'));

        // Show current
        cards[index].classList.add('active');
        dots[index].classList.add('active');

        // Re-initialize Lucide icons for the new card
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }

    function nextSlide() {
        currentIndex = (currentIndex + 1) % cards.length;
        showSlide(currentIndex);
    }

    function prevSlide() {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        showSlide(currentIndex);
    }

    function startAutoSlide() {
        intervalId = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    }

    function stopAutoSlide() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    // Navigation buttons
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            stopAutoSlide();
            nextSlide();
            startAutoSlide();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            stopAutoSlide();
            prevSlide();
            startAutoSlide();
        });
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoSlide();
            currentIndex = index;
            showSlide(currentIndex);
            startAutoSlide();
        });
    });

    // Pause on hover
    if (sliderWrapper) {
        sliderWrapper.addEventListener('mouseenter', () => {
            isPaused = true;
            stopAutoSlide();
        });
        sliderWrapper.addEventListener('mouseleave', () => {
            isPaused = false;
            startAutoSlide();
        });
    }

    // Touch/swipe support
    let touchStartX = 0;
    const slider = document.querySelector('.testimonials-slider');
    if (slider) {
        slider.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        slider.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                stopAutoSlide();
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
                startAutoSlide();
            }
        }, { passive: true });
    }

    // Start auto-slide
    startAutoSlide();
}

// ==================== PROJECT FILTER ====================

function initProjectFilter() {
    const tabs = document.querySelectorAll('.filter-tab');
    const cards = document.querySelectorAll('.project-card');

    if (!tabs.length || !cards.length) return;

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const filter = tab.getAttribute('data-filter');

            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            // Filter cards
            cards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.classList.remove('hidden');
                    card.classList.add('filtering-in');
                    setTimeout(() => {
                        card.classList.remove('filtering-in');
                    }, 400);
                } else {
                    card.classList.add('filtering-out');
                    setTimeout(() => {
                        card.classList.add('hidden');
                        card.classList.remove('filtering-out');
                    }, 300);
                }
            });
        });
    });
}

// ==================== PROJECT CARD TILT ====================

function initProjectTilt() {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            setTimeout(() => {
                card.style.transition = 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)';
            }, 10);
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 100ms ease-out';
        });
    });
}

// ==================== CARD MOUSE TRACKING GLOW ====================

function initCardGlow() {
    // Only enable on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const cards = document.querySelectorAll('.project-card, .service-card');

    cards.forEach(card => {
        // Create glow element
        const glow = document.createElement('div');
        glow.className = 'card-glow';
        glow.style.cssText = `
            position: absolute;
            width: 200px;
            height: 200px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(56, 189, 248, 0.12) 0%, transparent 70%);
            pointer-events: none;
            opacity: 0;
            transition: opacity 300ms ease;
            transform: translate(-50%, -50%);
            z-index: 0;
        `;
        card.style.position = 'relative';
        card.style.overflow = 'hidden';
        card.appendChild(glow);

        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            glow.style.left = x + 'px';
            glow.style.top = y + 'px';
            glow.style.opacity = '1';
        });

        card.addEventListener('mouseleave', () => {
            glow.style.opacity = '0';
        });
    });
}

// ==================== NAVBAR BEHAVIOR ====================

function initNavbarBehavior() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScrollY = window.scrollY;
    let ticking = false;

    function updateNavbar() {
        const scrollY = window.scrollY;

        // Scrolled state (add backdrop blur)
        if (scrollY > 80) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = scrollY;
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateNavbar);
            ticking = true;
        }
    });

    // Active section detection
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .mobile-menu-link');

    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.getAttribute('id');
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        },
        { threshold: 0.3, rootMargin: '-72px 0px 0px 0px' }
    );

    sections.forEach(section => sectionObserver.observe(section));
}

// ==================== MOBILE MENU ====================

function initMobileMenu() {
    const hamburger = document.getElementById('nav-hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const overlay = document.getElementById('mobile-menu-overlay');
    const closeBtn = document.getElementById('mobile-menu-close');
    const menuLinks = document.querySelectorAll('.mobile-menu-link');

    if (!hamburger || !mobileMenu || !overlay) return;

    function openMenu() {
        mobileMenu.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        hamburger.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.classList.remove('active');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
    }

    hamburger.addEventListener('click', openMenu);
    closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);

    // Close on link click
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
}

// ==================== FORM VALIDATION ====================

function initFormValidation() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('form-success');

    // Create spinner element
    const spinner = document.createElement('div');
    spinner.className = 'btn-spinner';
    submitBtn.style.position = 'relative';
    submitBtn.appendChild(spinner);

    // Create success text element
    const successText = document.createElement('div');
    successText.className = 'btn-success-text';
    successText.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Message Sent!';
    submitBtn.appendChild(successText);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous errors
        clearErrors();

        let isValid = true;

        // Validate Name
        const name = document.getElementById('name');
        if (!name.value.trim()) {
            showError(name, 'name-error', 'This field is required');
            isValid = false;
        }

        // Validate Email
        const email = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.value.trim()) {
            showError(email, 'email-error', 'This field is required');
            isValid = false;
        } else if (!emailRegex.test(email.value)) {
            showError(email, 'email-error', 'Please enter a valid email address');
            isValid = false;
        }

        // Validate Subject
        const subject = document.getElementById('subject');
        if (!subject.value.trim()) {
            showError(subject, 'subject-error', 'This field is required');
            isValid = false;
        }

        // Validate Message
        const message = document.getElementById('message');
        if (!message.value.trim()) {
            showError(message, 'message-error', 'This field is required');
            isValid = false;
        }

        if (isValid) {
            // Show loading state
            submitBtn.classList.add('loading');

            // Simulate submission
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.classList.add('success');

                // Show success message
                if (successMsg) successMsg.classList.add('visible');

                // Reset form
                form.reset();

                // Reset after 3 seconds
                setTimeout(() => {
                    submitBtn.classList.remove('success');
                    if (successMsg) successMsg.classList.remove('visible');
                }, 3000);
            }, 1500);
        }
    });

    // Clear errors on input
    form.querySelectorAll('.form-input').forEach(input => {
        input.addEventListener('input', () => {
            input.classList.remove('error');
            const errorEl = document.getElementById(input.id + '-error');
            if (errorEl) errorEl.textContent = '';
        });
    });
}

function showError(input, errorId, message) {
    input.classList.add('error');
    const errorEl = document.getElementById(errorId);
    if (errorEl) errorEl.textContent = message;
}

function clearErrors() {
    document.querySelectorAll('.form-input').forEach(input => {
        input.classList.remove('error');
    });
    document.querySelectorAll('.form-error').forEach(el => {
        el.textContent = '';
    });
}

// ==================== CURSOR GLOW ====================

function initCursorGlow() {
    // Only on fine pointer devices (desktop with mouse)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const glow = document.getElementById('cursor-glow');
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isActive = false;
    let rafId = null;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isActive) {
            isActive = true;
            glow.classList.add('visible');
            startTracking();
        }
    });

    document.addEventListener('mouseleave', () => {
        isActive = false;
        glow.classList.remove('visible');
        if (rafId) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    });

    function startTracking() {
        function update() {
            if (!isActive) return;

            // Smooth follow with lerp
            currentX += (mouseX - currentX) * 0.15;
            currentY += (mouseY - currentY) * 0.15;

            glow.style.left = currentX + 'px';
            glow.style.top = currentY + 'px';

            rafId = requestAnimationFrame(update);
        }

        rafId = requestAnimationFrame(update);
    }
}

// ==================== SCROLL TO TOP ====================

function initScrollToTop() {
    const btn = document.getElementById('scroll-to-top');
    if (!btn) return;

    // Show/hide based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            btn.classList.add('visible');
        } else {
            btn.classList.remove('visible');
        }
    });

    // Scroll to top on click
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ==================== STATUS TEXT CYCLE ====================

function initStatusTextCycle() {
    const statusText = document.getElementById('status-text');
    if (!statusText) return;

    const statuses = ['Building...', 'Compiling...', 'Ready!'];
    let index = 0;

    setInterval(() => {
        index = (index + 1) % statuses.length;
        statusText.textContent = statuses[index];
    }, 3000);
}

// ==================== ANIMATED DIVIDERS ====================

function initAnimatedDividers() {
    const dividers = document.querySelectorAll('.animated-divider');
    if (!dividers.length) return;

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );

    dividers.forEach(divider => observer.observe(divider));
}

// ==================== SKILL PERCENTAGE COUNTER ====================

// This is handled within the skill bar IntersectionObserver in initSkillBars
// We also animate the percentage numbers alongside the bars

// Extend skill bars to also count up percentages
(function extendSkillBars() {
    const originalInitSkillBars = initSkillBars;
    // The percentage animation is already triggered by the same observer
    // that animates the bar width. We add the number animation here.
    
    document.addEventListener('DOMContentLoaded', () => {
        const skillPercents = document.querySelectorAll('.skill-percent');
        if (!skillPercents.length) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry, index) => {
                    if (entry.isIntersecting) {
                        const target = parseInt(entry.target.getAttribute('data-target'));
                        setTimeout(() => {
                            animateNumber(entry.target, 0, target, 1200, '%');
                        }, index * 150);
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.5 }
        );

        skillPercents.forEach(el => observer.observe(el));
    });
})();

// ==================== SMOOTH SCROLL FOR ANCHOR LINKS ====================

// Handle all internal anchor links for smooth scrolling
document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (href === '#') return;

    const target = document.querySelector(href);
    if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
});

// ==================== SCROLL INDICATOR HIDE ====================

(function initScrollIndicator() {
    const indicator = document.getElementById('scroll-indicator');
    if (!indicator) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            indicator.classList.add('hidden');
        }
    });
})();
