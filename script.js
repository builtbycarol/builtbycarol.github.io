// DayOnePros Portfolio Website JavaScript

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
    let lastScrollY = window.scrollY;

    function handleScroll() {
        const currentScrollY = window.scrollY;

        // Add/remove scrolled class for styling
        if (currentScrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
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

    // ===== Intersection Observer for Fade-in Animations =====
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe all cards and content sections
    const animatedElements = document.querySelectorAll(
        '.service-card, .portfolio-card, .testimonial-card, .contact-card, .about-content'
    );

    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
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
            color: var(--olive) !important;
        }
    `;
    document.head.appendChild(style);

    // ===== Services Carousel =====
    const servicesTrack = document.getElementById('services-track');
    const servicesPrevBtn = document.getElementById('services-prev');
    const servicesNextBtn = document.getElementById('services-next');
    const servicesDotsContainer = document.getElementById('services-dots');

    if (servicesTrack && servicesPrevBtn && servicesNextBtn && servicesDotsContainer) {
        const serviceCards = servicesTrack.querySelectorAll('.service-card');
        let servicesCurrentIndex = 0;

        function getServicesPerPage() {
            // On mobile: 1 card, on desktop: 4 cards (2x2 grid)
            return window.innerWidth <= 768 ? 1 : 4;
        }

        let servicesPerPage = getServicesPerPage();

        function getServicesTotalPages() {
            return Math.ceil(serviceCards.length / servicesPerPage);
        }

        function createServicesDots() {
            servicesDotsContainer.innerHTML = '';
            const totalPages = getServicesTotalPages();
            for (let i = 0; i < totalPages; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to page ${i + 1}`);
                dot.addEventListener('click', () => goToServicesPage(i));
                servicesDotsContainer.appendChild(dot);
            }
        }

        function updateServicesCarousel() {
            const containerWidth = servicesTrack.parentElement.offsetWidth;
            const gap = 24;

            if (window.innerWidth <= 768) {
                // Mobile: single column, scroll by card
                const cardWidth = containerWidth;
                servicesTrack.style.display = 'flex';
                servicesTrack.style.flexDirection = 'column';
                servicesTrack.style.transform = `translateY(-${servicesCurrentIndex * (serviceCards[0].offsetHeight + gap)}px)`;
            } else {
                // Desktop: 2-column grid, scroll by showing different set of 4 cards
                servicesTrack.style.display = 'grid';
                servicesTrack.style.gridTemplateColumns = 'repeat(2, 1fr)';

                // Hide all cards first, then show only the ones for current page
                serviceCards.forEach((card, index) => {
                    const startIndex = servicesCurrentIndex * servicesPerPage;
                    const endIndex = startIndex + servicesPerPage;
                    if (index >= startIndex && index < endIndex) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            }

            // Update dots
            const dots = servicesDotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === servicesCurrentIndex);
            });

            // Update button states
            servicesPrevBtn.disabled = servicesCurrentIndex === 0;
            servicesNextBtn.disabled = servicesCurrentIndex >= getServicesTotalPages() - 1;
        }

        function goToServicesPage(index) {
            servicesCurrentIndex = index;
            updateServicesCarousel();
        }

        function nextServicesPage() {
            if (servicesCurrentIndex < getServicesTotalPages() - 1) {
                servicesCurrentIndex++;
                updateServicesCarousel();
            }
        }

        function prevServicesPage() {
            if (servicesCurrentIndex > 0) {
                servicesCurrentIndex--;
                updateServicesCarousel();
            }
        }

        servicesPrevBtn.addEventListener('click', prevServicesPage);
        servicesNextBtn.addEventListener('click', nextServicesPage);

        // Handle resize
        window.addEventListener('resize', () => {
            const newServicesPerPage = getServicesPerPage();
            if (newServicesPerPage !== servicesPerPage) {
                servicesPerPage = newServicesPerPage;
                servicesCurrentIndex = 0;
                createServicesDots();
                updateServicesCarousel();
            }
        });

        // Initialize
        createServicesDots();
        updateServicesCarousel();

        // Touch/swipe support for services
        let servicesTouchStartY = 0;
        let servicesTouchEndY = 0;

        servicesTrack.addEventListener('touchstart', (e) => {
            servicesTouchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        servicesTrack.addEventListener('touchend', (e) => {
            servicesTouchEndY = e.changedTouches[0].screenY;
            handleServicesSwipe();
        }, { passive: true });

        function handleServicesSwipe() {
            const swipeThreshold = 50;
            const diff = servicesTouchStartY - servicesTouchEndY;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextServicesPage();
                } else {
                    prevServicesPage();
                }
            }
        }
    }

    // ===== Portfolio Carousel =====
    const track = document.getElementById('portfolio-track');
    const prevBtn = document.getElementById('portfolio-prev');
    const nextBtn = document.getElementById('portfolio-next');
    const dotsContainer = document.getElementById('portfolio-dots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.portfolio-card');
        let currentIndex = 0;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            return window.innerWidth <= 768 ? 1 : 2;
        }

        function getTotalSlides() {
            return Math.ceil(cards.length / cardsPerView);
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            const totalSlides = getTotalSlides();
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => goToSlide(i));
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 32;
            const offset = currentIndex * (cardWidth + gap) * (cardsPerView === 1 ? 1 : 1);

            if (cardsPerView === 1) {
                track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            } else {
                track.style.transform = `translateX(-${currentIndex * (cardWidth + gap)}px)`;
            }

            // Update dots
            const dots = dotsContainer.querySelectorAll('.carousel-dot');
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });

            // Update button states
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex >= getTotalSlides() - 1;
        }

        function goToSlide(index) {
            currentIndex = index;
            updateCarousel();
        }

        function nextSlide() {
            if (currentIndex < getTotalSlides() - 1) {
                currentIndex++;
                updateCarousel();
            }
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);

        // Handle resize
        window.addEventListener('resize', () => {
            const newCardsPerView = getCardsPerView();
            if (newCardsPerView !== cardsPerView) {
                cardsPerView = newCardsPerView;
                currentIndex = 0;
                createDots();
                updateCarousel();
            }
        });

        // Initialize
        createDots();
        updateCarousel();

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    nextSlide();
                } else {
                    prevSlide();
                }
            }
        }
    }
});
