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

    // ===== Hero Typing Effect =====
    const heroTitle = document.getElementById('hero-title');
    const heroSubtitle = document.getElementById('hero-subtitle');
    const heroCta = document.querySelector('.hero-cta');

    const titleText = "Your Past Customers Are Worth Thousands. Let's Prove It.";
    const subtitleText = "AI-powered follow up systems for service businesses that are too busy working to chase leads.";

    function typeText(element, text, speed = 50) {
        return new Promise((resolve) => {
            let index = 0;
            element.innerHTML = '<span class="typing-cursor"></span>';

            function type() {
                if (index < text.length) {
                    const cursor = element.querySelector('.typing-cursor');
                    const textSpan = document.createElement('span');
                    textSpan.textContent = text.charAt(index);
                    element.insertBefore(textSpan, cursor);
                    index++;
                    setTimeout(type, speed);
                } else {
                    resolve();
                }
            }

            type();
        });
    }

    function removeCursor(element) {
        const cursor = element.querySelector('.typing-cursor');
        if (cursor) cursor.remove();
    }

    async function runTypingAnimation() {
        // Type the title
        await typeText(heroTitle, titleText, 60);

        // Brief pause after title
        await new Promise(resolve => setTimeout(resolve, 400));

        // Remove cursor from title, start typing subtitle
        removeCursor(heroTitle);
        await typeText(heroSubtitle, subtitleText, 30);

        // Remove cursor from subtitle after a brief moment
        await new Promise(resolve => setTimeout(resolve, 500));
        removeCursor(heroSubtitle);

        // Fade in the CTA button
        heroCta.classList.add('visible');
    }

    // Start typing animation after a short delay
    setTimeout(runTypingAnimation, 600);

    // ===== Section Scroll Fade-in Animations =====
    const sectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, sectionObserverOptions);

    // Add fade-in class to sections and observe them
    const animatedSections = document.querySelectorAll('.services, .portfolio, .testimonials, .industries, .about, .faq, .contact');
    animatedSections.forEach(section => {
        section.classList.add('fade-in-section');
        sectionObserver.observe(section);
    });

    // ===== Intersection Observer for Card Fade-in Animations =====
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
        '.service-card, .portfolio-card, .testimonial-card, .faq-item, .about-content, .contact-primary-cta'
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

    // ===== Portfolio Carousel =====
    const track = document.getElementById('portfolio-track');
    const prevBtn = document.getElementById('portfolio-prev');
    const nextBtn = document.getElementById('portfolio-next');
    const dotsContainer = document.getElementById('portfolio-dots');
    const portfolioCarousel = document.querySelector('.portfolio-carousel');

    let portfolioAutoScrollInterval = null;
    const PORTFOLIO_AUTO_SCROLL_DELAY = 5000; // 5 seconds

    if (track && prevBtn && nextBtn && dotsContainer) {
        const cards = track.querySelectorAll('.portfolio-card');
        let currentIndex = 0;
        let cardsPerView = getCardsPerView();

        function getCardsPerView() {
            return window.innerWidth <= 768 ? 1 : 2;
        }

        function getTotalSlides() {
            return Math.max(1, cards.length - cardsPerView + 1);
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            const totalSlides = getTotalSlides();
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('carousel-dot');
                if (i === 0) dot.classList.add('active');
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetPortfolioAutoScroll();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateCarousel() {
            const cardWidth = cards[0].offsetWidth;
            const gap = 32;

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
            } else {
                // Loop back to beginning for auto-scroll
                currentIndex = 0;
            }
            updateCarousel();
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
                updateCarousel();
            }
        }

        // Auto-scroll functions
        function startPortfolioAutoScroll() {
            if (portfolioAutoScrollInterval) return;
            portfolioAutoScrollInterval = setInterval(() => {
                nextSlide();
            }, PORTFOLIO_AUTO_SCROLL_DELAY);
        }

        function stopPortfolioAutoScroll() {
            if (portfolioAutoScrollInterval) {
                clearInterval(portfolioAutoScrollInterval);
                portfolioAutoScrollInterval = null;
            }
        }

        function resetPortfolioAutoScroll() {
            stopPortfolioAutoScroll();
            startPortfolioAutoScroll();
        }

        // Event listeners
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetPortfolioAutoScroll();
        });

        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetPortfolioAutoScroll();
        });

        // Pause on hover
        portfolioCarousel.addEventListener('mouseenter', stopPortfolioAutoScroll);
        portfolioCarousel.addEventListener('mouseleave', startPortfolioAutoScroll);

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
        startPortfolioAutoScroll();

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopPortfolioAutoScroll();
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startPortfolioAutoScroll();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                if (diff > 0) {
                    if (currentIndex < getTotalSlides() - 1) {
                        currentIndex++;
                        updateCarousel();
                    }
                } else {
                    prevSlide();
                }
            }
        }
    }

});
