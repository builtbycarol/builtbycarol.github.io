// DayOnePros Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // ===== Mobile Navigation Toggle =====
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');

    navToggle.addEventListener('click', function() {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // ===== Navbar Scroll Effect =====
    const navbar = document.getElementById('navbar');

    function handleScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });

    // ===== Smooth Scroll for Anchor Links =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Active Navigation Link Highlighting =====
    const sections = document.querySelectorAll('section[id]');

    function highlightNavLink() {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + sectionId) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavLink, { passive: true });

    // ===== Hero CTA Fade-in =====
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
        setTimeout(() => {
            heroCta.classList.add('visible');
        }, 400);
    }

    // ===== Section Scroll Fade-in Animations =====
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    const animatedSections = document.querySelectorAll('.how-i-work, .results, .about, .contact');
    animatedSections.forEach(section => {
        section.classList.add('fade-in-section');
        sectionObserver.observe(section);
    });

    // ===== Card / Element Fade-in Animations =====
    const elementObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { root: null, rootMargin: '0px', threshold: 0.1 });

    const animatedElements = document.querySelectorAll(
        '.how-i-work-block, .result-card, .about-content, .contact-primary-cta'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        elementObserver.observe(el);
    });

    // ===== Add CSS for fade-in animation =====
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }

        .fade-in.visible {
            opacity: 1;
            transform: translateY(0);
        }

        .nav-link.active {
            color: var(--lime) !important;
        }

        .nav-cta.active {
            color: var(--forest) !important;
        }
    `;
    document.head.appendChild(style);

});
